import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import { queryPromiseAdapter, queryPromiseAdapterWithPlaceholders } from "./utils/databaseConnection.js";
import getCurrentDateTimeAsString from "./utils/dateTimeConverter.js";
import bioRouter from "./routes/bio.js";
import { registerRouter, loginRouter, adminLoginRouter } from "./routes/authentication.js";
import { userMetadataRouter } from "./routes/userMetadata.js";
import { messageRouter } from "./routes/message.js";
import { currentMatchesRouter, matchUsersRouter, unmatchUsersRouter } from "./routes/match.js";

dotenv.config({ path: ".env" });
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

const app = express();
app.use(express.json()); // If this is not included, then we will not be able to read json sent in request body
app.use(cors()); // If this is not included, then the frontend will not be able to recieve responses from the api
// because the browsers will not allow it.

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/admin-login', adminLoginRouter);
app.use('/bio', bioRouter);
app.use('/user-metadata', userMetadataRouter);
app.use('/message-history-of-current-match', messageRouter);
app.use('/user-matches', currentMatchesRouter);
app.use('/match-users', matchUsersRouter);
app.use('/unmatch', unmatchUsersRouter)

// Middleware for WebSocket connections
io.use((socket, next) => {
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

/*
The message object must be of the format:
{
    content: "..."
    matchedUsername: "..."
}
*/
io.on("connection", async (socket) => {
  socket.join(socket.username);
  console.log(`${socket.username} has connected`);
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


// If the PORT environment variable is not set in the computer, then use port 3000 by default
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
