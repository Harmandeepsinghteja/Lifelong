import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import { db } from "../utils/databaseConnection.js";
import { TOKEN_SECRET_KEY, ADMIN_USERNAME, ADMIN_PASSWORD } from "../utils/environmentVariables.js";

export const registerRouter = express.Router();
export const loginRouter = express.Router();
export const adminLoginRouter = express.Router();

const saltRounds = 10;

// POST /register
// Input: username, password (attached to request body)
// Output: 201 Created status, and the response will contain the token.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
const verifyRegistration = (req, res, next) => {
  // This checks whether the name, or password is empty
  if (!req.body.username || !req.body.password) {
    res.status(400).json("Invalid registration details");
    return;
  }

  var sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [req.body.username], (err, data) => {
    if (err) {
      return res.status(500).json({ error: `Server side error: ${err}` });
    }
    if (data.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }
    next();
  });
};


registerRouter.post('/', verifyRegistration, async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const sql = `INSERT INTO users (username, password)
                     VALUES (?, ?)`;
    db.query(sql, [req.body.username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json(`Server side error: ${err}`);

      const token = jwt.sign({ username: req.body.username }, TOKEN_SECRET_KEY);
      res.status(201).json({ token: token });
    });
  } catch (err) {
    res.status(500).json(`Server side error: ${err}`);
  }
});

loginRouter.post('/', async (req, res, next) => {
  try {
    const sql = `SELECT password FROM users WHERE username = ?`;
    db.query(sql, [req.body.username], async (err, results) => {
      if (err) return res.status(500).json(`Server side error: ${err}`);
      if (results.length === 0) return res.status(404).json('User not found');

      const hashedPassword = results[0].password;
      const match = await bcrypt.compare(req.body.password, hashedPassword);
      if (match) {
        const token = jwt.sign({ username: req.body.username }, TOKEN_SECRET_KEY);
        res.status(200).json({ token: token });
      } else {
        res.status(401).json('Invalid password');
      }
    });
  }
  catch (err) {
    res.status(500).json(`Server side error: ${err}`);
  }
});

// POST /admin-login
// Input: Username and password (attached to request body)
// Output: 200 OK status, and the response will contain the token.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
adminLoginRouter.post('/', (req, res, next) => {
  if (
    req.body.username === ADMIN_USERNAME &&
    req.body.password === ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ adminUsername: ADMIN_USERNAME }, TOKEN_SECRET_KEY);
    res.json({ admin_token: token });
  } else {
    return res.status(400).json("Invalid admin credentials");
  }
});
