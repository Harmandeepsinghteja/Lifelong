import { GoogleGenerativeAI } from "@google/generative-ai";
import { matchUsersGemini } from "../llmHelper.js"; 
import { jest } from "@jest/globals";

// Mock the GoogleGenerativeAI module
jest.mock("@google/generative-ai");


describe("matchUsersGemini", () => {
  test("should return matches in the expected format", async () => {
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

    

    const result = await matchUsersGemini(usersData);

    // Check if the result matches the expected format
    expect(result).toHaveProperty("matches");
    expect(Array.isArray(result.matches)).toBe(true);

    result.matches.forEach((match) => {
      expect(match).toMatchObject({
        userId: expect.any(Number),
        matchUserId: expect.any(Number),
        reason: expect.any(String),
        rating: expect.any(Number),
      });
    });
  });
});