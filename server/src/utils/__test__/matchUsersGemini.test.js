import { GoogleGenerativeAI } from "@google/generative-ai";
import { matchUsersGemini } from "../llmHelper.js";
import { jest } from "@jest/globals";

// Mock the GoogleGenerativeAI module
jest.mock("@google/generative-ai");

describe("matchUsersGemini", () => {
  jest.setTimeout(20000);
  test("should return matches in the expected format", async () => {
    console.log("\n🧪 Starting test: matchUsersGemini function");
    console.log("------------------------------------------------");
    // Mock user data
    const usersData = [
      {
        id: 1,
        name: "Alice",
        age: 25,
        location: "New York",
        interests: ["hiking", "reading", "coding"],
        food: "Italian",
        movies: ["Inception", "The Matrix"],
        degree: "Computer Science",
      },
      {
        id: 2,
        name: "Bob",
        age: 30,
        location: "San Francisco",
        interests: ["music", "photography", "coding"],
        food: "Mexican",
        movies: ["The Godfather", "Pulp Fiction"],
        degree: "Electrical Engineering",
      },
      {
        id: 3,
        name: "Charlie",
        age: 28,
        location: "Los Angeles",
        interests: ["sports", "movies", "coding"],
        food: "Chinese",
        movies: ["The Dark Knight", "Fight Club"],
        degree: "Mechanical Engineering",
      },
      {
        id: 4,
        name: "David",
        age: 35,
        location: "Chicago",
        interests: ["traveling", "cooking", "coding"],
        food: "Indian",
        movies: ["Forrest Gump", "The Shawshank Redemption"],
        degree: "Civil Engineering",
      },
      {
        id: 5,
        name: "Eve",
        age: 22,
        location: "Boston",
        interests: ["dancing", "painting", "coding"],
        food: "Japanese",
        movies: ["Spirited Away", "My Neighbor Totoro"],
        degree: "Fine Arts",
      },
      {
        id: 6,
        name: "Frank",
        age: 27,
        location: "Seattle",
        interests: ["gaming", "reading", "coding"],
        food: "American",
        movies: ["Star Wars", "The Avengers"],
        degree: "Information Technology",
      },
      {
        id: 7,
        name: "Grace",
        age: 32,
        location: "Austin",
        interests: ["yoga", "photography", "coding"],
        food: "Thai",
        movies: ["The Lion King", "Frozen"],
        degree: "Graphic Design",
      },
      {
        id: 8,
        name: "Hank",
        age: 29,
        location: "Denver",
        interests: ["hiking", "music", "coding"],
        food: "French",
        movies: ["Amélie", "Ratatouille"],
        degree: "Environmental Science",
      },
      {
        id: 9,
        name: "Ivy",
        age: 26,
        location: "Miami",
        interests: ["swimming", "reading", "coding"],
        food: "Greek",
        movies: ["Mamma Mia!", "300"],
        degree: "Marine Biology",
      },
      {
        id: 10,
        name: "Jack",
        age: 31,
        location: "Portland",
        interests: ["cycling", "movies", "coding"],
        food: "Spanish",
        movies: ["Pan's Labyrinth", "The Others"],
        degree: "History",
      },
    ];

    console.log(`📊 Test data: ${usersData.length} users provided`);


    console.log("🤖 Mocked Gemini API response set up");
    console.log("\n🏃‍♂️ Executing matchUsersGemini function...");
    const result = await matchUsersGemini(usersData);

    console.log("\n🔍 Checking result format:");
    console.log(JSON.stringify(result, null, 2));

    // Check if the result matches the expected format
    console.log("\n✅ Verifying result structure:");
    expect(result).toHaveProperty("matches");
    console.log("  ✓ Result has 'matches' property");


    expect(Array.isArray(result.matches)).toBe(true);
    console.log("  ✓ 'matches' is an array");


    console.log("\n🧐 Examining each match:");
    result.matches.forEach((match) => {
      expect(match).toMatchObject({
        userId: expect.any(Number),
        matchUserId: expect.any(Number),
        reason: expect.any(String),
        rating: expect.any(Number),
      });

      console.log(`  ✓ userId: ${match.userId}`);
      console.log(`  ✓ matchUserId: ${match.matchUserId}`);
      console.log(`  ✓ reason: "${match.reason}"`);
      console.log(`  ✓ rating: ${match.rating}`);
    });
    console.log("\n🎉 Test completed successfully!");
  });
});