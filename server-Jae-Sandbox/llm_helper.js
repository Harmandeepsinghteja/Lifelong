const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config({ path: "../.env" });

// Get Keys from .env file
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


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




module.exports = { matchUsers };