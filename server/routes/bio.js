import express from "express";

import {db} from "../utils/databaseConnection.js";
import {verifyToken, attachUserIdToRequest} from '../utils/requestPreprocessing.js';

const bioAttributes = [
  "age",
  "occupation",
  "gender",
  "ethnicity",
  "country",
  "homeCountry",
  "maritalStatus",
  "exchangeType",
  "messageFrequency",
  "bio",
];

const bioRouter = express.Router();

const verifyBioPostRequestBody = (req, res, next) => {
    // Check if request body includes all bio attributes (and no non-bio attributes)
    const attributesInRequestBody = Object.keys(req.body);
    if (
      attributesInRequestBody.sort().join(",") !== bioAttributes.sort().join(",")
    ) {
      return res
        .status(400)
        .json(
          "Please include all bio attributes and do not send any non-bio attributes in the request body"
        );
    }
  
    // Check if each bio attribute is non-empty
    for (var bioAttribute of bioAttributes) {
      if (!req.body[bioAttribute]) {
        return res
          .status(400)
          .json(
            `Please include the ${bioAttribute} attribute, it cannot be empty or null`
          );
      }
    }
    next();
  };
  
  const attachBioAsList = (req, res, next) => {
    var bioValues = [req.userId];
    for (const bioAttribute of bioAttributes) {
      bioValues.push(req.body[bioAttribute]);
    }
    req.bioValues = bioValues;
    next();
  };
  
  // POST /bio
  // Input: 1) All the bio attributes, attached to the request body.
  //        2) Login token, attached to the header with the key set to "token".
  // Output: 201 Created status.
  //         (The bio will be created for the user associated with the token).
  // Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
  bioRouter.post(
    "/",
    verifyToken,
    attachUserIdToRequest,
    verifyBioPostRequestBody,
    attachBioAsList,
    (req, res, next) => {
      const bioAttributesWithUserId = ["userId"].concat(bioAttributes);
      const sql = `INSERT INTO bio (${bioAttributesWithUserId.toString()}) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
      db.query(sql, req.bioValues, (err, result) => {
        if (err) return res.status(500).json(`Server side error: ${err}`);
        res.status(201).json();
      });
    }
  );
  
  // GET /bio
  // Input: 1) Login token, attached to the header with the key set to "token".
  // Output: 200 OK status, and the bio of the user will be returned as a json object.
  // Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
  bioRouter.get("/", verifyToken, attachUserIdToRequest, (req, res, next) => {
    var sql = "SELECT * FROM bio WHERE userId = ?";
    db.query(sql, [req.userId], (err, data) => {
      if (err) {
        return res.status(500).json(`Server side error: ${err}`);
      }
      if (data.length === 0) {
        return res.status(404).json("User does not have bio");
      }
      delete data[0].userId; // No need to return userId to the user
      return res.json(data[0]);
    });
  });
  
  const verifyBioPatchRequestBody = (req, res, next) => {
    // Check if all properties of request body are bio attributes
    for (var bioAttribute in req.body) {
      if (!bioAttributes.includes(bioAttribute)) {
        return res
          .status(400)
          .json(`${bioAttribute} is not a valid bio attribute`);
      }
    }
  
    // Check if each bio attribute is non-empty
    for (var bioAttribute in req.body) {
      if (!req.body[bioAttribute]) {
        return res
          .status(400)
          .json("Request body must contain only non-empty properties");
      }
    }
    next();
  };
  
  const bioPatchQueryBuilder = (requestBody, userId) => {
    const setStatementTemplate = Object.entries(requestBody)
      .map(([key, value]) => `${key} = ?`)
      .join(", ");
  
    const sql = `UPDATE bio 
              SET ${setStatementTemplate}
              WHERE userId = ${userId}`;
    return sql;
  };
  
  // PATCH /bio
  // Input: 1) Login token, attached to the header with the key set to "token".
  //        2) A json object containing only the fields of the bio that need to be updated (attached to the request body).
  // Output: 200 OK status, and the updated bio of the user (containing all the fields, not just the fields that were updated) will be returned as a json object.
  // Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
  bioRouter.patch(
    "/",
    verifyToken,
    attachUserIdToRequest,
    verifyBioPatchRequestBody,
    (req, res, next) => {
      const sql = bioPatchQueryBuilder(req.body, req.userId);
  
      db.query(sql, Object.values(req.body), (err, result) => {
        if (err) return res.status(500).json(`Server side error: ${err}`);
        res.status(200).json();
      });
    }
  );


export default bioRouter;
