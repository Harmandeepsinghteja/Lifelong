import { GoogleGenerativeAI } from "@google/generative-ai";
import { matchUsersGemini } from "../llmHelper.js";
import { jest } from "@jest/globals";

// Mock the GoogleGenerativeAI module
jest.mock("@google/generative-ai");

describe("matchUsersGemini", () => {
  jest.setTimeout(30000);
  test("should return matches in the expected format", async () => {
    console.log("\n🧪 Starting test: matchUsersGemini function");
    console.log("------------------------------------------------");
    // Mock user data
    const usersData = [
      {
        userId: 3,
        bioAttributes: {
          age: 30,
          occupation: "Hotdog vendor",
          gender: "Male",
          ethnicity: "Polynesian",
          country: "Antarctica",
          homeCountry: "Easter Island",
          maritalStatus: "Single",
          exchangeType: "Casual Chat",
          messageFrequency: "Weekly",
          bio: "I love coding, reading sci-fi novels, and hiking. Big foodie here!",
        },
      },
      {
        userId: 4,
        bioAttributes: {
          age: 40,
          occupation: "Business Analyst",
          gender: "Female",
          ethnicity: "Nigerian",
          country: "Canada",
          homeCountry: "Nigeria",
          maritalStatus: "Single",
          exchangeType: "Casual Chat",
          messageFrequency: "Weekly",
          bio: "I love coding, reading sci-fi novels, and hiking. Big foodie here!",
        },
      },
      {
        userId: 5,
        bioAttributes: {
          age: 50,
          occupation: "Carpenter",
          gender: "Male",
          ethnicity: "South African",
          country: "Antarctica",
          homeCountry: "South Africa",
          maritalStatus: "Single",
          exchangeType: "Casual Chat",
          messageFrequency: "Weekly",
          bio: "I love coding, reading sci-fi novels, and hiking. Big foodie here!",
        },
      },
      {
        userId: 7,
        bioAttributes: {
          age: 27,
          occupation: "Teacher",
          gender: "Female",
          ethnicity: "Asian",
          country: "Japan",
          homeCountry: "Tokyo",
          maritalStatus: "Single",
          exchangeType: "Friendship",
          messageFrequency: "Weekly",
          bio: "I love teaching and mentoring.",
        },
      },
      {
        userId: 8,
        bioAttributes: {
          age: 32,
          occupation: "Doctor",
          gender: "Male",
          ethnicity: "Caucasian",
          country: "Germany",
          homeCountry: "Berlin",
          maritalStatus: "Married",
          exchangeType: "Business",
          messageFrequency: "Monthly",
          bio: "I am passionate about healthcare.",
        },
      },
      {
        userId: 9,
        bioAttributes: {
          age: 26,
          occupation: "Nurse",
          gender: "Female",
          ethnicity: "African",
          country: "Nigeria",
          homeCountry: "Lagos",
          maritalStatus: "Single",
          exchangeType: "Dating",
          messageFrequency: "Daily",
          bio: "I enjoy caring for others.",
        },
      },
      {
        userId: 10,
        bioAttributes: {
          age: 31,
          occupation: "Lawyer",
          gender: "Male",
          ethnicity: "Asian",
          country: "China",
          homeCountry: "Beijing",
          maritalStatus: "Married",
          exchangeType: "Networking",
          messageFrequency: "Weekly",
          bio: "I love practicing law.",
        },
      },
    ];

    

    // console.log(`📊 Test data: ${usersData.length} users provided`);


    // console.log("🤖 Mocked Gemini API response set up");
    console.log("\n🏃‍♂️ Executing matchUsersGemini function...");
    const result = await matchUsersGemini(usersData);

    // console.log("\n🔍 Checking result format:");
    // console.log(JSON.stringify(result, null, 2));

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
      // console.log(`  ✓ rating: ${match.rating}`);
    });
    console.log("\n🎉 Test completed successfully!");
  });
});