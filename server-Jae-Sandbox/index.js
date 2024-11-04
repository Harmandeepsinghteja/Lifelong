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
    sender: 1,
    text: "I am the user!",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    sender: 2,
    text: "I am the matched user!",
    timestamp: new Date().toISOString(),
  },
];

// Endpoint to fetch initial messages
app.get("/messages", (req, res) => {
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

app.post("/admin-login", (req, res, next) => {
  const loginIsSuccessful = true;
  if (loginIsSuccessful) {
    // Generate the token and send it to the user
    const adminToken = jwt.sign({ adminUsername: "admin" }, SECRET_KEY);
    res.json({ adminToken: adminToken });
  }
});

app.get("/user-metadata", (req, res, next) => {
  const token = req.headers.token;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json("Invalid token, cannot be decrypted");
    } else {
      res.status(200).json({
        username: decoded.username,
        userID: 1,
        bioComplete: true,
        matchedUserID: 2,
        matchedUsername: "Jason",
      });
    }
  });
});

// Protected route to get user bio
app.get("/bio", (req, res, next) => {
  const token = req.headers.token;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json("Invalid token, cannot be decrypted");
    } else {
      const userBio = {
        age: 28,
        occupation: "Software Developer",
        gender: "Nonbinary",
        ethnicity: "Asian",
        country: "Canada",
        homeCountry: "India",
        maritalStatus: "Single",
        exchangeType: "Casual Chat",
        messageFrequency: "Weekly",
        bio: "I love coding, reading sci-fi novels, and hiking. Big foodie here!",
      };
      res.status(200).json(userBio);
    }
  });
});

app.get("/user-matches", (req, res) => {
  const adminToken = req.headers.adminToken;
  console.log(`Token from request headers: ${adminToken}`);
  // jwt.verify(adminToken, SECRET_KEY, (err, decoded) => {
  //   if (err) {
  //     res.status(401).json("Invalid token, cannot be decrypted");
  //   } else {
  const userMatches = [
    {
      username: "User1",
      matchedUsername: "UserA",
      reason: "Shared Interests",
    },
    {
      username: "User2",
      matchedUsername: "UserB",
      reason: "Proximity"
    },
    {
      username: "User3",
      matchedUsername: "UserC",
      reason: "Mutual Friends",
    },
  ];
  res.status(200).json(userMatches);
  // }
  // });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
