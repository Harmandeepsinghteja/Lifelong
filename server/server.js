import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { createServer } from "node:http";
import { Server } from "socket.io";
import processMatches from "./llm_helper.js";
import {db, queryPromiseAdapter, queryPromiseAdapterWithPlaceholders} from "./database_connection.js";

const SECRET_KEY = "secret";
const bioAttributes = [
  "age",
  "occupation",
  "gender",
  "ethnicity",
  "country",
  "homeCountry",
  "maritalStatus",
  "exchangeType",
  "messageFrequency",
  "bio",
];
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password";

const app = express();
app.use(express.json());    // If this is not included, then we will not be able to read json sent in request body
app.use(cors());            // If this is not included, then the frontend will not be able to recieve responses from the api
                            // because the browsers will not allow it.

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(404).json("Please provide login token");
  } else {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json();
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
};

const attachUserIdToRequest = (req, res, next) => {
  const sql = "SELECT id FROM users WHERE username = ?";
  db.query(sql, [req.username], (err, data) => {
    // Exampled of returned data: [ RowDataPacket { id: 1 } ]
    if (err || data.length === 0) {
      return res.status(500).json(`Server side error: ${err}`);
    }
    req.userId = data[0].id;
    next();
  });
};

app.post('/login', async (req, res, next) => {
    try {
        const sql = `SELECT password FROM users WHERE username = ?`;
        db.query(sql, [req.body.username], async (err, results) => {
            if (err) return res.status(500).json(`Server side error: ${err}`);
            if (results.length === 0) return res.status(404).json('User not found');

            const hashedPassword = results[0].password;
            const match = await bcrypt.compare(req.body.password, hashedPassword);
            console.log(match);
            if (match) {
                const token = jwt.sign({username: req.body.username}, SECRET_KEY);
                res.status(200).json({token: token});
            } else {
                res.status(401).json('Invalid password');
            }
        });
    } 
    catch (err) {
        res.status(500).json(`Server side error: ${err}`);
    }
});

// POST /admin-login
// Input: Username and password (attached to request body)
// Output: 200 OK status, and the response will contain the token.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
app.post("/admin-login", (req, res, next) => {
  if (
    req.body.username === ADMIN_USERNAME &&
    req.body.password === ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ ADMIN_USERNAME }, SECRET_KEY);
    res.json({ admin_token: token });
  } else {
    return res.status(400).json("Invalid admin credentials");
  }
});

app.get("/username", verifyToken, (req, res, next) => {
  // The verifyToken middleware ensures that the token is valid, so inside the body of this function we can
  // safely assume that the token has been validated.
  return res.status(200).json(req.username); // Username is attached to the request in the verifyToken middleware
});

const verifyRegistration = (req, res, next) => {
  // This checks whether the name, or password is empty
  if (!req.body.username || !req.body.password) {
    res.status(400).json("Invalid registration details");
    return;
  }

  var sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [req.body.username], (err, data) => {
    if (err) {
      return res.status(500).json({ error: `Server side error: ${err}` });
    }
    if (data.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }
    next();
  });
};

// POST /register
// Input: username, password (attached to request body)
// Output: 201 Created status, and the response will contain the token.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.

const saltRounds = 10;
app.post('/register', verifyRegistration, async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const sql = `INSERT INTO users (username, password)
                     VALUES (?, ?)`;
        db.query(sql, [req.body.username, hashedPassword], (err, result) => {
            if (err) return res.status(500).json(`Server side error: ${err}`);

            const token = jwt.sign({username: req.body.username}, SECRET_KEY);
            res.status(201).json({token: token});
        });
    } catch (err) {
        res.status(500).json(`Server side error: ${err}`);
    }
});

const verifyBioPostRequestBody = (req, res, next) => {
  // Check if request body includes all bio attributes (and no non-bio attributes)
  const attributesInRequestBody = Object.keys(req.body);
  if (
    attributesInRequestBody.sort().join(",") !== bioAttributes.sort().join(",")
  ) {
    return res
      .status(400)
      .json(
        "Please include all bio attributes and do not send any non-bio attributes in the request body"
      );
  }

  // Check if each bio attribute is non-empty
  for (var bioAttribute of bioAttributes) {
    if (!req.body[bioAttribute]) {
      return res
        .status(400)
        .json(
          `Please include the ${bioAttribute} attribute, it cannot be empty or null`
        );
    }
  }
  next();
};

const attachBioAsList = (req, res, next) => {
  var bioValues = [req.userId];
  for (const bioAttribute of bioAttributes) {
    bioValues.push(req.body[bioAttribute]);
  }
  req.bioValues = bioValues;
  next();
};

// POST /bio
// Input: 1) All the bio attributes, attached to the request body.
//        2) Login token, attached to the header with the key set to "token".
// Output: 201 Created status.
//         (The bio will be created for the user associated with the token).
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
app.post(
  "/bio",
  verifyToken,
  attachUserIdToRequest,
  verifyBioPostRequestBody,
  attachBioAsList,
  (req, res, next) => {
    const bioAttributesWithUserId = ["userId"].concat(bioAttributes);
    const sql = `INSERT INTO bio (${bioAttributesWithUserId.toString()}) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, req.bioValues, (err, result) => {
      if (err) return res.status(500).json(`Server side error: ${err}`);
      res.status(201).json();
    });
  }
);

// GET /bio
// Input: 1) Login token, attached to the header with the key set to "token".
// Output: 200 OK status, and the bio of the user will be returned as a json object.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
app.get("/bio", verifyToken, attachUserIdToRequest, (req, res, next) => {
  var sql = "SELECT * FROM bio WHERE userId = ?";
  db.query(sql, [req.userId], (err, data) => {
    if (err) {
      return res.status(500).json(`Server side error: ${err}`);
    }
    if (data.length === 0) {
      return res.status(404).json("User does not have bio");
    }
    delete data[0].userId; // No need to return userId to the user
    return res.json(data[0]);
  });
});

const verifyBioPatchRequestBody = (req, res, next) => {
  // Check if all properties of request body are bio attributes
  for (var bioAttribute in req.body) {
    if (!bioAttributes.includes(bioAttribute)) {
      return res
        .status(400)
        .json(`${bioAttribute} is not a valid bio attribute`);
    }
  }

  // Check if each bio attribute is non-empty
  for (var bioAttribute in req.body) {
    if (!req.body[bioAttribute]) {
      return res
        .status(400)
        .json("Request body must contain only non-empty properties");
    }
  }
  next();
};

const bioPatchQueryBuilder = (requestBody, userId) => {
  const setStatementTemplate = Object.entries(requestBody)
    .map(([key, value]) => `${key} = ?`)
    .join(", ");

  const sql = `UPDATE bio 
            SET ${setStatementTemplate}
            WHERE userId = ${userId}`;
  return sql;
};

// PATCH /bio
// Input: 1) Login token, attached to the header with the key set to "token".
//        2) A json object containing only the fields of the bio that need to be updated (attached to the request body).
// Output: 200 OK status, and the updated bio of the user (containing all the fields, not just the fields that were updated) will be returned as a json object.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
app.patch(
  "/bio",
  verifyToken,
  attachUserIdToRequest,
  verifyBioPatchRequestBody,
  (req, res, next) => {
    const sql = bioPatchQueryBuilder(req.body, req.userId);

    db.query(sql, Object.values(req.body), (err, result) => {
      if (err) return res.status(500).json(`Server side error: ${err}`);
      res.status(200).json();
    });
  }
);

// GET /user-metadata
// Input: 1) Login token, attached to the header with the key set to "token".
// Output: 200 OK status, and the json object containing the following user metadata:
// {
// userId: ...,
// username: ...,
// bioComplete: <this will be a boolean>,
// matchedUserID: ...,
// matchedUsername: ...,
// }
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.

app.get(
  "/user-metadata",
  verifyToken,
  attachUserIdToRequest,
  async (req, res, next) => {
    var metaData = { userID: req.userId, username: req.username };
    try {
      // Check if bio is complete
      var sql = `SELECT * FROM bio WHERE bio.userId = ${req.userId}`;
      var result = await queryPromiseAdapter(sql);

      if (result.length === 0) {
        metaData.bioComplete = false;
        return res.json(metaData);
      }
      metaData.bioComplete = true;

      // Find the id and username of the matched user. If nothing is returned, it means that the user is not matched
      sql = `SELECT users.id, users.username
            FROM users
            JOIN user_match on users.id = user_match.matchedUserId
            WHERE user_match.userId = ${req.userId} AND user_match.unmatchedTime IS NULL;`;
      result = await queryPromiseAdapter(sql);

      // If nothing is returned in the sql query, it means that the user is not matched
      if (result.length === 0) {
        return res.json(metaData);
      }
      // If user is matched, add id and username of the matched user to the return object
      metaData.matchedUserId = result[0].id;
      metaData.matchedUsername = result[0].username;
      return res.json(metaData);
    } catch (err) {
      return res.status(500).json(`Server side error: ${err}`);
    }
  }
);

// Middleware for WebSocket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.username = decoded.username; // Attach the username to the socket object
    next();
  });
});

io.use(async (socket, next) => {
  try {
    const sql = "SELECT id FROM users WHERE username = ?";
    const result = await queryPromiseAdapterWithPlaceholders(sql, [
      socket.username,
    ]);
    socket.userId = result[0].id;
    next();
  } catch (err) {
    console.log(err);
    return err;
  }
});

const getCurrentDateTimeAsString = () => {
  var dateTime = new Date();
  dateTime =
    dateTime.getUTCFullYear() +
    "-" +
    ("00" + (dateTime.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("00" + dateTime.getUTCDate()).slice(-2) +
    " " +
    ("00" + dateTime.getUTCHours()).slice(-2) +
    ":" +
    ("00" + dateTime.getUTCMinutes()).slice(-2) +
    ":" +
    ("00" + dateTime.getUTCSeconds()).slice(-2);
  return dateTime;
};

/*
The message object must be of the format:
{
    content: "..."
    matchedUsername: "..."
}
*/
io.on("connection", async (socket) => {
  socket.join(socket.username);
  console.log(`${socket.username} has connected`)
  socket.on("messageHistory", async (message) => {
    try {
      // Get messages sent by the user or the matched user for their current match
      const sql = `SELECT message.id, user_match.userId as senderId, message.content, message.createdTime
                FROM message
                JOIN user_match on message.matchId = user_match.id
                WHERE (user_match.userId = ${socket.userId} OR user_match.matchedUserId = ${socket.userId}) AND
                    user_match.unmatchedTime IS NULL
                ORDER BY message.createdTime;`;
      const result = await queryPromiseAdapter(sql);
      io.to(socket.username).emit("messageHistory", result);
    } catch (err) {
      console.log(err);
      return err;
    }
  });

  socket.on("message", async (message) => {
    try {
      // Get current match id of user
      var sql = `
                SELECT user_match.id, user_match.matchedUserId
                FROM user_match
                JOIN users on users.id = user_match.userId
                WHERE users.username = '${socket.username}' AND user_match.unmatchedTime IS NULL`;

      var result = await queryPromiseAdapter(sql);
      if (result.length === 0) {
        return new Error("Could not find current match id of user");
      }
      const matchId = result[0].id;
      const matchedUserId = result[0].matchedUserId;

      // Get username of matched user
      sql = `SELECT users.username 
                FROM users
                WHERE id = ${matchedUserId};`;
      result = await queryPromiseAdapter(sql);
      const matchedUsername = result[0].username;

      // Insert the message into the message table
      const createdTime = getCurrentDateTimeAsString();
      sql = `INSERT INTO message (matchId, content, createdTime)
                VALUES (?, ?, ?);`;
      result = await queryPromiseAdapterWithPlaceholders(sql, [
        matchId,
        message.content,
        createdTime,
      ]);

      // Emit the message to both the user and the matched user
      io.to(matchedUsername).emit("message", {
        senderId: socket.userId,
        content: message.content,
        createdTime: createdTime,
      });
      io.to(socket.username).emit("message", {
        senderId: socket.userId,
        content: message.content,
        createdTime: createdTime,
      });
    } catch (err) {
      console.log(err);
      return err;
    }
  });
});

//JKJK
// io.on('connection', async (socket) => {
//     socket.join(socket.username);
//     socket.on('message', async (message) => {

//         try {
//             // Get current match id of user
//             var sql = `
//                 SELECT user_match.id
//                 FROM user_match
//                 JOIN users on users.id = user_match.userId
//                 WHERE users.username = '${socket.username}' AND user_match.unmatchedTime IS NULL`;

//             var result = await queryPromiseAdapter(sql);
//             if (result.length === 0) {
//                 return new Error('Could not find current match id of user');
//             }
//             const matchId = result[0].id;

//             // Insert the message into the message table
//             const createdTime = getCurrentDateTimeAsString();
//             sql = `INSERT INTO message (matchId, content, createdTime)
//                 VALUES (?, ?, ?);`;
//             result = await queryPromiseAdapterWithPlaceholders(sql, [matchId, message.content, createdTime]);

//             // Emit the message to the matched user
//             io.to(message.matchedUsername).emit('message', message.content);
//         }
//         catch (err) {
//             console.log(err)
//             return err;
//         }

//     });
// });

app.get(
  "/message-history-of-current-match",
  verifyToken,
  attachUserIdToRequest,
  async (req, res, next) => {
    try {
      // Get messages sent by the user or the matched user for their current match
      const sql = `SELECT message.id, user_match.userId as senderId, message.content, message.createdTime
            FROM message
            JOIN user_match on message.matchId = user_match.id
            WHERE (user_match.userId = ${req.userId} OR user_match.matchedUserId = ${req.userId}) AND
                user_match.unmatchedTime IS NULL
            ORDER BY message.createdTime;`;
      const result = await queryPromiseAdapter(sql);
      res.json(result);
    } catch (err) {
      return res.status(500).json(`Server side error: ${err}`);
    }
  }
);

const getCurrentUserMatches = async () => {
  // Get all user matches (both current and previous), but with the reverse version of each match eliminated
  const sql = 
      `WITH user_match_with_usernames AS (
          SELECT \`user\`.username, matched_user.username as matchedUsername, user_match.reason
          FROM user_match
          JOIN users as \`user\` on user_match.userId = \`user\`.id
          JOIN users as matched_user on user_match.matchedUserId = matched_user.id
          WHERE user_match.unmatchedTime IS NULL 
      )
      -- Eliminate the reverse versions of each match
      SELECT DISTINCT
      CASE WHEN username >= matchedUsername THEN matchedUsername ELSE username END as username,
      CASE WHEN username < matchedUsername THEN matchedUsername ELSE username END as matchedUsername,
      reason
      FROM user_match_with_usernames

      UNION

      SELECT DISTINCT users.username, NULL as matchedUsername, NULL as reason
      FROM users
      WHERE users.id NOT IN (SELECT user_match.userId
                              FROM user_match
                              WHERE user_match.unmatchedTime IS NULL)
          -- Only retrieve unmatched users who have completed their bio
          AND users.id IN (SELECT bio.userId FROM bio);`;

  const result = await queryPromiseAdapter(sql);
  return result;
}

// TODO: Implement verifyAdminToken, which decrypts the admin token and checks if the decrypted username matches the admin username
app.get('/user-matches', verifyToken, async (req, res, next) => {
  try {
      const result = await getCurrentUserMatches();
      return res.json(result);
  }
  catch (err) {
      return res.status(500).json(`Server side error: ${err}`);
  }
});


const getUnmatchedUserIdsWithBio = async () => {
  const sql = `SELECT bio.userId
      FROM bio
      WHERE bio.userId NOT IN (
          SELECT user_match.userId
          FROM user_match
          WHERE user_match.unmatchedTime IS NULL
      ) 
      ORDER BY bio.userId;`;
      
  const result = await queryPromiseAdapter(sql);
  const unmatchedUserIds = result.map(obj => obj.userId);
  return unmatchedUserIds;  
}

const getPreviousMatches = async() => {
  const sql = `SELECT user_match.userId, user_match.matchedUserId
  FROM user_match
  WHERE user_match.unmatchedTime IS NOT NULL
  ORDER BY user_match.userId;`;
      
  const previousMatches = await queryPromiseAdapter(sql);
  return previousMatches;
  /* console.log(result)
  const previousMatches = result.map(obj => [obj.userId, obj.matchedUserId]);
  console.log(previousMatches);
  return previousMatches;   */
}


// TODO: Implement verifyAdminToken, which decrypts the admin token and checks if the decrypted username matches the admin username
app.post('/match-users-manual', async (req, res, next) => {
  const unmatchedUserIdsWithBio = await getUnmatchedUserIdsWithBio();
  const previousMatches = await getPreviousMatches();

  const potentialMatches = {};
  unmatchedUserIdsWithBio.forEach(id => {
      potentialMatches[id] = unmatchedUserIdsWithBio.filter(elem => elem !== id)        
  });

  // For each user id, remove the user ids that this user has been matched with before
  for (const {userId, matchedUserId} of previousMatches) {
      if (potentialMatches[userId]) {
          potentialMatches[userId] = potentialMatches[userId].filter(elem => elem != matchedUserId)
      }
  }
  
  // now randomly make matches
  // To check if an id has already been matched, keep a set/list of newly matches user ids
  const newMatchedUserIds = [];
  const newMatchedUserIdPairs = [];
  for (var userId in potentialMatches) {
      userId = parseInt(userId);
      if (newMatchedUserIds.includes(userId)) {
          continue;
      }
      // Remove ids that are already matched from list of potential match ids
      const potentialMatchIds = potentialMatches[userId].filter(elem => !newMatchedUserIds.includes(elem));
      if (potentialMatchIds.length > 0) {
          const matchedUserId = potentialMatchIds[Math.floor(Math.random() * potentialMatchIds.length)];
          newMatchedUserIds.push(userId);
          newMatchedUserIds.push(matchedUserId);
          newMatchedUserIdPairs.push([userId, matchedUserId]);

      }
  }
  // TODO: insert pairs in newMatchedUserIdPairs (as well as their corresponding reverse pairs) into user_matches table in database
  for (var pair of newMatchedUserIdPairs) {
      try {
          const sql = `INSERT INTO user_match (userId, matchedUserId, reason, createdTime)
              VALUES 
                (?, ?, ?, ?);`;
          const createdTime = getCurrentDateTimeAsString();
          queryPromiseAdapterWithPlaceholders(sql, [pair[0], pair[1], 'dummy reason', createdTime]);
          queryPromiseAdapterWithPlaceholders(sql, [pair[1], pair[0], 'dummy reason', createdTime]);
      }
      catch (err) {
          return res.status(500).json(`Server side error: ${err}`);
      }
  }

  const currentUserMatches = await getCurrentUserMatches();
  return res.status(201).json(currentUserMatches);
});

// Endpoint to get user matches
app.post("/match-users", async (req, res) => {
    try {
      await processMatches();
      const currentUserMatches = await getCurrentUserMatches();
      console.log("Result is:");
      console.log(currentUserMatches);
      res.json(currentUserMatches);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


app.delete('/unmatch', verifyToken, attachUserIdToRequest, async (req, res, next) => {
  try {
      // Get messages sent by the user or the matched user for their current match
      const sql = `UPDATE user_match
          SET unmatchedTime = now()
          WHERE user_match.userId = ${req.userId} OR user_match.matchedUserId = ${req.userId}; `;
      const result = await queryPromiseAdapter(sql);
      res.status(204).json();
  }
  catch (err) {
      return res.status(500).json(`Server side error: ${err}`);
  }
});

// If the PORT environment variable is not set in the computer, then use port 3000 by default
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
