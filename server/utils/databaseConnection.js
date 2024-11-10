import mysql from "mysql";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from "./environmentVariables.js";

export const db = mysql.createPool({
    connectionLimit: 10, 
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});

// Test the database connection pool
db.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database:", err.stack);
    } else {
        console.log("Connected to the database.");
        connection.release(); // Release the connection back to the pool
    }
});

export const queryPromiseAdapter = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
  
export const queryPromiseAdapterWithPlaceholders = (sql, args) => {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};