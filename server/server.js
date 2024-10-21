import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'secret';

const app = express();
app.use(express.json());   // If this is not included, then we will not be able to read json sent in request body
app.use(cors());  ///// If program doesn't work it could be because I excluded stuff inside cors
                    // If this is not included, then the frontend will not be able to recieve responses from the api
                    // because the browsers will not allow it.

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "lifelong_db",
});

const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(404).json('Please provide login token');
    }
    else {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json();
            }
            else {
                req.username = decoded.username;
                next();
            }
        });
    }
    next();
}

app.post('/login', (req, res, next) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json('Server side error');
        }
        if (data.length === 0) {
            return res.status(404).json('Username does not exist or password is incorrect');
        }
        const username = data[0].username;
        const token = jwt.sign({username}, SECRET_KEY);
        res.json({token: token});
    });
});

app.get('/name', verifyToken, (req, res, next) => {
    // The verifyToken middleware ensures that the token is valid, so inside the body of this function we can
    // safely assume that the token has been validated.
    return res.status(200).json(req.username);   // Username is attached to the request in the verifyToken middleware

});

const verifyNotEmpty = (req, res, next) => {
    if (!req.body.username || !req.body.email || !req.body.password) {        // This checks whether the name, email or password is empty
        res.status(400).json('Invalid registration details');
        return;
    }
    next();
}

const verifyUsername = (req, res, next) => {
    var sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [req.body.username], (err, data) => {
        if (err) {
            return res.status(500).json(`Server side error: ${err}`);
        }
        if (data.length > 0) {
            return res.status(400).json('Username already exists');
        }
        next();
    });
}

const verifyEmail = (req, res, next) => {
    var sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            return res.status(500).json(`Server side error: ${err}`);
        }
        if (data.length > 0) {
            return res.status(400).json('Email already exists');
        }
        next();
    });
}

// POST /register
// Input: email, username, password (attached to request body)
// Output: 201 Created status, and the response will contain the token.
// Alternate Output: Some other status like 404 or 500, and the response will contain the error message.
app.post('/register', verifyNotEmpty, verifyUsername, verifyEmail, (req, res, next) => {
    const sql = `INSERT INTO users (email, username, password)
                 VALUES (?, ?, ?)`;
    db.query(sql, [req.body.email, req.body.username, req.body.password], (err, result) => {
        if (err) return res.status(500).json(`Server side error: ${err}`);

        const token = jwt.sign({username: req.body.username}, SECRET_KEY);
        res.status(201).json({token: token});
    });
});

// If the PORT environment variable is not set in the computer, then use port 3000 by default
app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});



