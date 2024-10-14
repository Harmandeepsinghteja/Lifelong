const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

let messages = [
  { id: 1, sender: "user", text: "Hello there!", timestamp: new Date() },
  {
    id: 2,
    sender: "bot",
    text: "Hi! How can I help you?",
    timestamp: new Date(),
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
