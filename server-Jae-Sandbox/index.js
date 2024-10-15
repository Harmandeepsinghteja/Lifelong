const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

//import cookieParser from 'cookie-parser';

const SECRET_KEY = "secret";

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

let messages = [
  {
    id: 1,
    sender: "user",
    text: "Hello there!",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    sender: "bot",
    text: "Hi! How can I help you?",
    timestamp: new Date().toISOString(),
  },
];

// Endpoint to fetch initial messages
app.get("/api/messages", (req, res) => {
  res.json({ messages });
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // Send existing messages to the new user
  socket.emit("initialMessages", messages);

  // Handle receiving a new message
  socket.on("sendMessage", (data) => {
    const { sender, text } = data;
    const newMessage = {
      id: messages.length + 1,
      sender,
      text,
      timestamp: new Date(),
    };
    messages.push(newMessage);
    io.emit("newMessage", newMessage); // Broadcast the new message to all connected clients
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Note: we do not need to implement a logout endpoint in the server.
// To log out, all the frontend needs to do is delete the token from localstorage and refresh the page.
app.post("/login", (req, res, next) => {
  const loginIsSuccessful = true;
  if (loginIsSuccessful) {
    // Generate the token and send it to the user
    const token = jwt.sign({ username: "user1" }, SECRET_KEY);
    res.json({ token: token });
  }
});

app.get("/name", (req, res, next) => {
  const token = req.headers.token;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json("Invalid token, cannot be decrypted");
    } else {
      req.username = decoded.username;
      res.status(200).json({
        key1: req.username,
        key2: "value2",
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
