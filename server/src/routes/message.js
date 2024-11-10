import express from "express";

import {queryPromiseAdapter} from "../config/databaseConnection.js";
import {verifyToken, attachUserIdToRequest} from '../utils/requestPreprocessing.js';

export const messageRouter = express.Router();

messageRouter.get( "/", verifyToken, attachUserIdToRequest, async (req, res, next) => {
    try {
      // Get messages sent by the user or the matched user for their current match
      const sql = `SELECT message.id, user_match.userId as senderId, message.content, message.createdTime
            FROM message
            JOIN user_match on message.matchId = user_match.id
            WHERE (user_match.userId = ${req.userId} OR user_match.matchedUserId = ${req.userId}) AND
                user_match.unmatchedTime IS NULL
            ORDER BY message.createdTime;`;
      const result = await queryPromiseAdapter(sql);
      res.json(result);
    } catch (err) {
      return res.status(500).json(`Server side error: ${err}`);
    }
  }
);
