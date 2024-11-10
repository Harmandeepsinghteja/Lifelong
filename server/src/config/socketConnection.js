import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { TOKEN_SECRET_KEY } from "./environmentVariables.js";
import { queryPromiseAdapter, queryPromiseAdapterWithPlaceholders } from "./databaseConnection.js";
import getCurrentDateTimeAsString from "../utils/dateTimeConverter.js";


const authenticateToken = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.username = decoded.username; // Attach the username to the socket object
    next();
  });
}

const attachIdToSocket = async (socket, next) => {
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
}

const getMatchDetails = async (username) => {
  var sql = `
    SELECT user_match.id, user_match.matchedUserId
    FROM user_match
    JOIN users on users.id = user_match.userId
    WHERE users.username = '${username}' AND user_match.unmatchedTime IS NULL`;

  var result = await queryPromiseAdapter(sql);
  if (result.length === 0) {
    throw new Error("Could not find current match id of user");
  }
  const matchId = result[0].id;
  const matchedUserId = result[0].matchedUserId;
  return { matchId: matchId, matchedUserId: matchedUserId };
}

const getMatchedUsername = async (matchedUserId) => {
  const sql = `
    SELECT users.username 
    FROM users
    WHERE id = ${matchedUserId};`;
  const result = await queryPromiseAdapter(sql);
  const matchedUsername = result[0].username;
  return matchedUsername;
}

const insertMessageIntoDatabase = async (matchId, messageContent) => {
  const createdTime = getCurrentDateTimeAsString();
  const sql = `
    INSERT INTO message (matchId, content, createdTime)
    VALUES (?, ?, ?);`;
  const result = await queryPromiseAdapterWithPlaceholders(sql, [
    matchId,
    messageContent,
    createdTime,
  ]);
  return createdTime;
}

const emitMessage = (io, username, message) => {
  io.to(username).emit("message", message);
}

const setUpSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });
  io.use(authenticateToken);
  io.use(attachIdToSocket);

  io.on("connection", async (socket) => {
    socket.join(socket.username);
    console.log(`${socket.username} has connected`);

    socket.on("message", async (message) => {
      try {
        /* getMatchId()
        getMatchUsername()
        insertMessage()
        emitMessage() */
        const { matchId, matchedUserId } = await getMatchDetails(socket.username);
        const matchedUsername = await getMatchedUsername(matchedUserId);
        const createdTime = await insertMessageIntoDatabase(matchId, message.content);
        
        const messageObj = {
          senderId: socket.userId,
          content: message.content,
          createdTime: createdTime,
        };

        // Emit the message to both the user and the matched user
        emitMessage(io, matchedUsername, messageObj);
        emitMessage(io, socket.username, messageObj);

      } catch (err) {
        console.log(err);
        return err;
      }
    });
  });

  return io;
}

export default setUpSocket;
