import jwt from "jsonwebtoken";

import { db } from "../config/databaseConnection.js";
import { TOKEN_SECRET_KEY, ADMIN_USERNAME } from "../config/environmentVariables.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(404).json("Please provide login token");
  } else {
    jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json();
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
};

export const verifyAdminToken = (req, res, next) => {
  const adminToken = req.headers.admin_token;
  if (!adminToken) {
    return res.status(404).json("Please provide admin token");
  } else {
    jwt.verify(adminToken, TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json();
        return;
      }
      if (decoded.adminUsername !== ADMIN_USERNAME) {
        res.status(401).json();
        return;
      }
      next();
    });
  }
}

export const attachUserIdToRequest = (req, res, next) => {
  const sql = "SELECT id FROM users WHERE username = ?";
  db.query(sql, [req.username], (err, data) => {
    // Exampled of returned data: [ RowDataPacket { id: 1 } ]
    if (err || data.length === 0) {
      return res.status(500).json(`Server side error: ${err}`);
    }
    req.userId = data[0].id;
    next();
  });
};
