import express from "express";

import {queryPromiseAdapter} from "../config/databaseConnection.js";
import {verifyToken, attachUserIdToRequest} from '../utils/requestPreprocessing.js';

// GET /user-metadata
// Input: 1) Login token, attached to the header with the key set to "token".
// Output: 200 OK status, and the json object containing the following user metadata:
// {
// userId: ...,
// username: ...,
// bioComplete: <this will be a boolean>,
// matchedUserID: ...,
// matchedUsername: ...,
// }
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.

export const userMetadataRouter = express.Router();

userMetadataRouter.get("/", verifyToken, attachUserIdToRequest, async (req, res, next) => {
    var metaData = { userID: req.userId, username: req.username };
    try {
      // Check if bio is complete
      var sql = `SELECT * FROM bio WHERE bio.userId = ${req.userId}`;
      var result = await queryPromiseAdapter(sql);

      if (result.length === 0) {
        metaData.bioComplete = false;
        return res.json(metaData);
      }
      metaData.bioComplete = true;

      // Find the id and username of the matched user. If nothing is returned, it means that the user is not matched
      sql = `SELECT users.id, users.username, user_match.reason
            FROM users
            JOIN user_match on users.id = user_match.matchedUserId
            WHERE user_match.userId = ${req.userId} AND user_match.unmatchedTime IS NULL;`;
      result = await queryPromiseAdapter(sql);

      // If nothing is returned in the sql query, it means that the user is not matched
      if (result.length === 0) {
        return res.json(metaData);
      }
      // If user is matched, add id and username of the matched user to the return object
      metaData.matchedUserId = result[0].id;
      metaData.matchedUsername = result[0].username;
      metaData.matchedReason = result[0].reason;
      return res.json(metaData);
    } catch (err) {
      return res.status(500).json(`Server side error: ${err}`);
    }
  }
);