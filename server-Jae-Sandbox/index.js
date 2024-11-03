const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

//import cookieParser from 'cookie-parser';
const OPENAI_API_KEY =
  "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";
const GEMINI_API_KEY = "AIzaSyAfP5xsuRdbdEjWjPoUVJekrp8L6yEZke8";

const SECRET_KEY = "secret";
console.log("OpenAI API Key:", OPENAI_API_KEY);

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

app.get("/user-meta-data", (req, res, next) => {
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
        matchedUsername: "",
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
    { username: "User2", matchedUsername: "UserB", reason: "Proximity" },
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

// Function to send user data to ChatGPT API and get matches
const matchUsersOpenAI = async (usersData) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // or gpt-4 if you are using it
        messages: [
          {
            role: "system",
            content:
              "You are a matching expert. Match users based on their interests to suggest pairs for a lifelong connection.",
          },
          {
            role: "user",
            content: `Here is the user data: ${JSON.stringify(
              usersData
            )}. Suggest the best pairs based on their interests.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`, // Use your OpenAI API key here
          "Content-Type": "application/json",
        },
      }
    );
    // Return the response from ChatGPT
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error calling OpenAI API:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to match users");
  }
};

// Function to send user data to Gemini API and get matches
const matchUsersGemini = async (usersData) => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Here is the user data: ${JSON.stringify(
      usersData
    )}. Suggest the best pairs based on their interests. Return the matches in strict JSON format with user IDs and shared interests.`;
    const result = await model.generateContent(prompt);

    // Ensure the response is valid JSON
    let jsonResponse = result.response.text();
    jsonResponse = jsonResponse.replace(/```json|```/g, "").trim(); // Remove the ```json and ``` markers and trim whitespace

    return JSON.parse(jsonResponse);
  } catch (error) {
    console.error(
      "Error calling Gemini API:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to match users with Gemini");
  }
};

// Function to match users using available API
const matchUsers = async (usersData) => {
  try {
    return await matchUsersOpenAI(usersData);
  } catch (error) {
    console.log("Falling back to Gemini API");
    return await matchUsersGemini(usersData);
  }
};

// Endpoint to get user matches
app.post("/match-users", async (req, res) => {
  const usersData = req.body;

  try {
    const matches = await matchUsers(usersData);
    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
