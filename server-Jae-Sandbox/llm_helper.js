const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mysql = require("mysql2"); 
const fetch = require("node-fetch"); // Ensure you have node-fetch installed
// const db = require("./db"); // Assuming you have a db module for database operations
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { createServer } = require("http");
const { Server } = require("socket.io");
// Get Keys from .env file

dotenv.config({ path: "../.env" });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DB_HOST = process.env.DB_HOST;
const DB_HOST_2 = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

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

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: process.env.DB_PORT,
});

// const testConnection = () => {
//   db.connect((err) => {
//     if (err) {
//       console.error("Error connecting to the database:", err);
//       return;
//     }
//     console.log("Connected to the database successfully!");
//   });
// };

// testConnection();



// Function to fetch user data from usertable and bio table using callbacks
const fetchUsersData = (callback) => {
  db.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return callback(err);
    }
    console.log("Connected to the database successfully!");

    const query = `
      SELECT u.id as userId, ${bioAttributes
        .map((attr) => `b.${attr}`)
        .join(", ")}
      FROM users u
      JOIN bio b ON u.id = b.userId
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching user data:", err);
        return callback(err);
      }
      // Format the results as needed
      const formattedResults = results.map((row) => ({
        userId: row.userId,
        bioAttributes: bioAttributes.reduce((acc, attr) => {
          acc[attr] = row[attr];
          return acc;
        }, {}),
      }));
      callback(null, formattedResults);
    });
  });
};

// Test function to test fetchUsersData
const testFetchUsersData = () => {
  fetchUsersData((err, usersData) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return;
    }
    console.log("Fetched user data:", usersData);
  });
};

// Call the test function
testFetchUsersData();


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
            )}. Please provide only one match per user.`,
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
    )}. For each user, please provide multiple interesting matches with a rating for each match. The matches do not need to share the same interests but should be based on complementary or diverse interests. Return the matches in strict JSON format with the following structure: {"matches": [{"userId": <userId>, "matchUserId": <matchUserId>, "reason": <reason>, "rating": <rating>}]}. Ensure that each user is matched only once, and each userId should appear in only one row.`;

    const result = await model.generateContent(prompt);
    // console.log(result.response.text());
    // Ensure the response is valid JSON

    let jsonResponse = result.response.text();
    // console.log(jsonResponse);
    // Remove the ```json and ``` markers and trim whitespace
    jsonResponse = jsonResponse.replace(/```json|```/g, "").trim();

    // Additional cleanup to ensure valid JSON
    jsonResponse = jsonResponse
      .replace(/^[^{[]+/, "")
      .replace(/[^}\]]+$/, "")
      .trim();
    
    const matches = JSON.parse(jsonResponse).matches;
    const bestMatches = [];
    const matchedUsers = new Set();

    // Find the best match for each user based on the rating
    matches.forEach((match) => {
      if (
        !matchedUsers.has(match.userId) &&
        !matchedUsers.has(match.matchUserId)
      ) {
        const existingMatchIndex = bestMatches.findIndex(
          (m) => m.userId === match.userId
        );
        if (
          existingMatchIndex === -1 ||
          bestMatches[existingMatchIndex].rating < match.rating
        ) {
          if (existingMatchIndex !== -1) {
            matchedUsers.delete(bestMatches[existingMatchIndex].matchUserId);
            bestMatches.splice(existingMatchIndex, 1);
          }
          bestMatches.push(match);
          matchedUsers.add(match.userId);
          matchedUsers.add(match.matchUserId);
        }
      }
    });



    return { matches: bestMatches };
  } catch (error) {
    console.error(
      "Error calling Gemini API:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to match users with Gemini");
  }
};

// Function to match users using available API
const matchUsers = async () => {
  try {
    const usersData = await new Promise((resolve, reject) => {
      fetchUsersData((err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
    return await matchUsersOpenAI(usersData);
  } catch (error) {
    console.log("Falling back to Gemini API");
    try {
      const usersData = await new Promise((resolve, reject) => {
        fetchUsersData((err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
      return await matchUsersGemini(usersData);
    } catch (err) {
      console.error("Error fetching user data for Gemini API:", err);
      throw err;
    }
  }
};

const insertMatchesIntoDB = async (matches) => {
  const db = getDatabaseConnection(); // Replace with your actual DB connection function
  const insertQuery = `
    INSERT INTO user_match (userId, matchedUserId, createdTime)
    VALUES (?, ?, ?)
  `;

  const currentTime = new Date().toISOString();

  for (const match of matches) {
    await db.run(insertQuery, [match.userId, match.matchUserId, currentTime]);
  }
};


// Call the matchUsers function
matchUsers().then(result => {
  console.log("Match result:", result);
}).catch(err => {
  console.error("Error matching users:", err);
});

module.exports = { matchUsers };
