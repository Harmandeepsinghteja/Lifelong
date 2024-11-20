import express from "express";

import { queryPromiseAdapter, queryPromiseAdapterWithPlaceholders } from "../config/databaseConnection.js";
import { verifyToken, attachUserIdToRequest, verifyAdminToken } from '../utils/requestPreprocessing.js';
import processMatches from "../utils/llmHelper.js";
import getCurrentDateTimeAsString from "../utils/dateTimeConverter.js";

export const currentMatchesRouter = express.Router();
export const matchUsersRouter = express.Router();
export const unmatchUsersRouter = express.Router();

const getCurrentUserMatches = async () => {
  // Get all user matches (both current and previous), but with the reverse version of each match eliminated
  const selectCurrentUserMatches = `
    SELECT \`user\`.username, matched_user.username as matchedUsername, user_match.reason
    FROM user_match
    JOIN users as \`user\` on user_match.userId = \`user\`.id
    JOIN users as matched_user on user_match.matchedUserId = matched_user.id
    WHERE user_match.unmatchedTime IS NULL `;
  
  const eliminateReverseVersionOfEachMatch = `
    SELECT DISTINCT
    CASE WHEN username >= matchedUsername THEN matchedUsername ELSE username END as username,
    CASE WHEN username < matchedUsername THEN matchedUsername ELSE username END as matchedUsername,
    reason
    FROM user_match_with_usernames`;
  
  const selectUnmatchedUsersWithCompleteBio = `
    SELECT DISTINCT users.username, NULL as matchedUsername, NULL as reason
    FROM users
    WHERE users.id NOT IN (SELECT user_match.userId
                            FROM user_match
                            WHERE user_match.unmatchedTime IS NULL)
      AND users.id IN (SELECT bio.userId FROM bio)`;

  const sql =
    `WITH user_match_with_usernames AS (
        ${selectCurrentUserMatches}
    )
    ${eliminateReverseVersionOfEachMatch}
    UNION
    ${selectUnmatchedUsersWithCompleteBio};`;

  const result = await queryPromiseAdapter(sql);
  return result;
}

currentMatchesRouter.get('/', verifyAdminToken, async (req, res, next) => {
  try {
    const result = await getCurrentUserMatches();
    return res.json(result);
  }
  catch (err) {
    return res.status(500).json(`Server side error: ${err}`);
  }
});

const getUnmatchedUserIdsWithBio = async () => {
  const sql = `SELECT bio.userId
        FROM bio
        WHERE bio.userId NOT IN (
            SELECT user_match.userId
            FROM user_match
            WHERE user_match.unmatchedTime IS NULL
        ) 
        ORDER BY bio.userId;`;

  const result = await queryPromiseAdapter(sql);
  const unmatchedUserIds = result.map(obj => obj.userId);
  return unmatchedUserIds;
}

const getPreviousMatches = async () => {
  const sql = `SELECT user_match.userId, user_match.matchedUserId
    FROM user_match
    WHERE user_match.unmatchedTime IS NOT NULL
    ORDER BY user_match.userId;`;

  const previousMatches = await queryPromiseAdapter(sql);
  return previousMatches;
}

const processMatchesManual = async () => {
  const unmatchedUserIdsWithBio = await getUnmatchedUserIdsWithBio();
  const previousMatches = await getPreviousMatches();

  const potentialMatches = {};
  unmatchedUserIdsWithBio.forEach(id => {
    potentialMatches[id] = unmatchedUserIdsWithBio.filter(elem => elem !== id)
  });

  // For each user id, remove the user ids that this user has been matched with before
  for (const { userId, matchedUserId } of previousMatches) {
    if (potentialMatches[userId]) {
      potentialMatches[userId] = potentialMatches[userId].filter(elem => elem != matchedUserId)
    }
  }

  // Now randomly make matches
  // To check if an id has already been matched, keep a set/list of newly matches user ids
  const newMatchedUserIds = [];
  const newMatchedUserIdPairs = [];
  for (var userId in potentialMatches) {
    userId = parseInt(userId);
    if (newMatchedUserIds.includes(userId)) {
      continue;
    }
    // Remove ids that are already matched from list of potential match ids
    const potentialMatchIds = potentialMatches[userId].filter(elem => !newMatchedUserIds.includes(elem));
    if (potentialMatchIds.length > 0) {
      const matchedUserId = potentialMatchIds[Math.floor(Math.random() * potentialMatchIds.length)];
      newMatchedUserIds.push(userId);
      newMatchedUserIds.push(matchedUserId);
      newMatchedUserIdPairs.push([userId, matchedUserId]);

    }
  }

  // Insert the new matches into the match table
  for (var pair of newMatchedUserIdPairs) {
    try {
      const sql = `INSERT INTO user_match (userId, matchedUserId, reason, createdTime)
                VALUES 
                  (?, ?, ?, ?);`;
      const createdTime = getCurrentDateTimeAsString();
      await queryPromiseAdapterWithPlaceholders(sql, [pair[0], pair[1], 'Unable to provide reason', createdTime]);
      await queryPromiseAdapterWithPlaceholders(sql, [pair[1], pair[0], 'Unable to provide reason', createdTime]);
    }
    catch (err) {
      console.error("Error error with manual matching:", err);
      throw err;
    }
  }
}

// TODO: Implement verifyAdminToken, which decrypts the admin token and checks if the decrypted username matches the admin username
matchUsersRouter.post("/", verifyAdminToken, async (req, res) => {
  try {
    await processMatches();
  } catch (err) {
    // If LLM throws error, then manually match the users
    try {
      await processMatchesManual()
      const currentUserMatches = await getCurrentUserMatches();
      res.json(currentUserMatches);
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
});

unmatchUsersRouter.delete('/', verifyToken, attachUserIdToRequest, async (req, res, next) => {
  try {
    const sql = `UPDATE user_match
            SET unmatchedTime = now()
            WHERE (user_match.userId = ${req.userId} OR user_match.matchedUserId = ${req.userId}) AND unmatchedTime IS NULL; `;
    const result = await queryPromiseAdapter(sql);
    res.status(204).json();
  }
  catch (err) {
    return res.status(500).json(`Server side error: ${err}`);
  }
});
