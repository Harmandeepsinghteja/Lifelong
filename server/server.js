import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'node:http';
import {Server} from "socket.io";

const SECRET_KEY = 'secret';
const bioAttributes = ['age', 'occupation','gender','ethnicity','country','homeCountry','maritalStatus',
    'exchangeType','messageFrequency','bio'];
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';

const app = express();
app.use(express.json());   // If this is not included, then we will not be able to read json sent in request body
app.use(cors());  ///// If program doesn't work it could be because I excluded stuff inside cors
                    // If this is not included, then the frontend will not be able to recieve responses from the api
                    // because the browsers will not allow it.

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "lifelong_db",
});

const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(404).json('Please provide login token');
    }
    else {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json();
            }
            else {
                req.username = decoded.username;
                next();
            }
        });
    }
}

const attachUserIdToRequest = (req, res, next) => {
    const sql = 'SELECT id FROM users WHERE username = ?';
    db.query(sql, [req.username], (err, data) => {         // Exampled of returned data: [ RowDataPacket { id: 1 } ]
        if (err || data.length === 0) {
            return res.status(500).json(`Server side error: ${err}`);
        }
        req.userId = data[0].id;
        next();
    });
    
}

app.post('/login', (req, res, next) => {
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json(`Server side error: ${err}`);
        }
        if (data.length === 0) {
            return res.status(404).json('Username does not exist or password is incorrect');
        }
        const username = data[0].username;
        const token = jwt.sign({username}, SECRET_KEY);
        res.json({token: token});
    });
});

// POST /admin-login
// Input: Username and password (attached to request body)
// Output: 200 OK status, and the response will contain the token.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
app.post('/admin-login', (req, res, next) => {
    if (req.body.username === ADMIN_USERNAME && req.body.password === ADMIN_PASSWORD) {
        const token = jwt.sign({ADMIN_USERNAME}, SECRET_KEY);
        res.json({admin_token: token});
    }
    else {
        return res.status(400).json('Invalid admin credentials');
    }
});


app.get('/username', verifyToken, (req, res, next) => {
    // The verifyToken middleware ensures that the token is valid, so inside the body of this function we can
    // safely assume that the token has been validated.
    return res.status(200).json(req.username);   // Username is attached to the request in the verifyToken middleware

});


const verifyRegistration = (req, res, next) => {
    // This checks whether the name, or password is empty
    if (!req.body.username || !req.body.password) {        
        res.status(400).json('Invalid registration details');
        return;
    }
    
    var sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [req.body.username], (err, data) => {
        if (err) {
            return res.status(500).json(`Server side error: ${err}`);
        }
        if (data.length > 0) {
            return res.status(400).json('Username already exists');
        }
        next();
    });
}

// POST /register
// Input: username, password (attached to request body)
// Output: 201 Created status, and the response will contain the token.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
app.post('/register', verifyRegistration, (req, res, next) => {
    const sql = `INSERT INTO users (username, password)
                 VALUES (?, ?)`;
    db.query(sql, [req.body.username, req.body.password], (err, result) => {
        if (err) return res.status(500).json(`Server side error: ${err}`);

        const token = jwt.sign({username: req.body.username}, SECRET_KEY);
        res.status(201).json({token: token});
    });
});

const verifyBioPostRequestBody = (req, res, next) => {
    // Check if request body includes all bio attributes (and no non-bio attributes)
    const attributesInRequestBody = Object.keys(req.body);
    if(attributesInRequestBody.sort().join(',') !== bioAttributes.sort().join(',')){
        return res.status(400).json('Please include all bio attributes and do not send any non-bio attributes in the request body');
    }

    // Check if each bio attribute is non-empty
    for (var bioAttribute of bioAttributes) {
        if (!req.body[bioAttribute]) {
            return res.status(400).json(`Please include the ${bioAttribute} attribute, it cannot be empty or null`);
        }
    }
    next()
}

const attachBioAsList = (req, res, next) => {
    var bioValues = [req.userId];
    for (const bioAttribute of bioAttributes) {
        bioValues.push(req.body[bioAttribute]);
    }
    req.bioValues = bioValues;
    next()
}

// POST /bio
// Input: 1) All the bio attributes, attached to the request body.
//        2) Login token, attached to the header with the key set to "token".
// Output: 201 Created status.
//         (The bio will be created for the user associated with the token).
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
app.post('/bio', verifyToken, attachUserIdToRequest, verifyBioPostRequestBody, attachBioAsList, (req, res, next) => {
    const bioAttributesWithUserId = ['userId'].concat(bioAttributes);
    const sql = `INSERT INTO bio (${bioAttributesWithUserId.toString()}) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, req.bioValues, (err, result) =>  {
        if (err) return res.status(500).json(`Server side error: ${err}`);
        res.status(201).json();
    });
});


// GET /bio
// Input: 1) Login token, attached to the header with the key set to "token".
// Output: 200 OK status, and the bio of the user will be returned as a json object.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
app.get('/bio', verifyToken, attachUserIdToRequest, (req, res, next) => {
    var sql = "SELECT * FROM bio WHERE userId = ?";
    db.query(sql, [req.userId], (err, data) => {
        if (err) {
            return res.status(500).json(`Server side error: ${err}`);
        }
        if (data.length === 0) {
            return res.status(404).json('User does not have bio');
        }
        delete data[0].userId;     // No need to return userId to the user
        return res.json(data[0]);
    });
});

const verifyBioPatchRequestBody = (req, res, next) => {
    // Check if all properties of request body are bio attributes
    for (var bioAttribute in req.body) {
        if (!bioAttributes.includes(bioAttribute)) {
            return res.status(400).json(`${bioAttribute} is not a valid bio attribute`);
        }
    }
    
    // Check if each bio attribute is non-empty
    for (var bioAttribute in req.body) {
        if (!req.body[bioAttribute]) {
            return res.status(400).json('Request body must contain only non-empty properties');
        }
    }
    next();
}
  
const bioPatchQueryBuilder = (requestBody, userId) => {
    const setStatementTemplate = Object.entries(requestBody)
        .map(([key, value]) => `${key} = ?`)
        .join(', ');
    
    const sql = `UPDATE bio 
            SET ${setStatementTemplate}
            WHERE userId = ${userId}`;
    return sql;
}

// PATCH /bio
// Input: 1) Login token, attached to the header with the key set to "token".
//        2) A json object containing only the fields of the bio that need to be updated (attached to the request body).
// Output: 200 OK status, and the updated bio of the user (containing all the fields, not just the fields that were updated) will be returned as a json object.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
app.patch('/bio',  verifyToken, attachUserIdToRequest, verifyBioPatchRequestBody, (req, res, next) => {
    const sql = bioPatchQueryBuilder(req.body, req.userId);

    db.query(sql, Object.values(req.body),(err, result) =>  {
        if (err) return res.status(500).json(`Server side error: ${err}`);
        res.status(200).json();
    });
    });


// GET /user-meta-data
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


const queryPromiseAdapter = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        }); 
    });
};


app.get('/test', async (req, res, next) => {

    const sql =  `SELECT users.id, users.username
        FROM users
        JOIN user_match on users.matchId = user_match.id
        WHERE users.id != 1`;
    try {
        const result = await queryPromiseAdapter(sql);
        console.log(result);
        res.json(result);
    }
    catch (err) {
        return res.status(500).json(`Server side error: ${err}`);
    }
    
});



app.get('/user-metadata', verifyToken, attachUserIdToRequest, async (req, res, next) => {
    var metaData = {userID: req.userId, username: req.username};

    // Check if bio is complete:
    var sql = `SELECT * FROM users WHERE id = ${req.userId}`;
    try {
        var result = await queryPromiseAdapter(sql);

        if (result.length === 0) {
            metaData.bioComplete = false;
            return res.json(metaData);
        }
        metaData.bioComplete = true;
        
        // Check if user is matched:
        const matchId = result[0].matchId;
        if (!matchId) {
            return res.json(metaData);
        }

        // If user is matched, add id and username of the matched user to the return object
        sql = `SELECT users.id, users.username
            FROM users
            JOIN user_match on users.matchId = user_match.id
            WHERE users.id != ${req.userId}`;
        
        result = await queryPromiseAdapter(sql);
        metaData.matchedUserId = result[0].id;
        metaData.matchedUsername = result[0].username;
        return res.json(metaData);

    }
    catch (err) {
        return res.status(500).json(`Server side error: ${err}`);
    }
});


io.on('connection', (socket) => {
    const username = socket.handshake.auth.username;
    socket.join(username);

    // We can use anything besides 'message' as well. The message variable can be a javascript object or a string
    socket.on('message', (message) =>     {   
        console.log(message);
        io.to(message.recipientUsername).emit('message', `${username} said ${message.content}` );
    });
});

// If the PORT environment variable is not set in the computer, then use port 3000 by default
server.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

