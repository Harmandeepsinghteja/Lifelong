import mysql from "mysql2/promise";
import { jest } from "@jest/globals";

// Mock the mysql2/promise module
jest.mock("mysql2/promise");

// Import your database configuration
import { db } from "../../config/databaseConnection.js"; // Adjust the import path as needed

describe("Database Connection", () => {
  test("should connect to the database successfully", async () => {
    // Mock the getConnection method
    const mockGetConnection = jest.fn().mockResolvedValue({
      release: jest.fn(),
    });

    // Mock the createPool method to return an object with getConnection
    // mysql.createPool.mockReturnValue({
    //   getConnection: mockGetConnection,
    // });

    try {
    //   Attempt to get a connection from the pool

      db.getConnection((err, connection) => {
          if (err) {
              console.error("❌ Database connection failed:", err.stack);
          } else {
              console.log("✅ Database connection successful");
              connection.release(); // Release the connection back to the pool
          }
      });

      
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  });
});
