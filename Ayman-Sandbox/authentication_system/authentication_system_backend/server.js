import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
//import cookieParser from 'cookie-parser';
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
    database: "login_db",
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
                req.username = decoded.name;
                next();
            }
        });
    }
    next();
}

// Note: we do not need to implement a logout endpoint in the server.
// To log out, all the frontend needs to do is delete the token from localstorage and refresh the page.
app.post('/login', (req, res, next) => {
    console.log(req.body);
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json('Server side error');
        }
        if (data.length === 0) {
            return res.status(404).json('Username does not exist or password is incorrect');
        }
        const name = data[0].name;
        const token = jwt.sign({name}, SECRET_KEY);
        res.json({token: token});
    });
});

app.get('/name', verifyToken, (req, res, next) => {
    // The verifyToken middleware ensures that the token is valid, so inside the body of this function we can
    // safely assume that the token has been validated.
    console.log(req.username);
    return res.status(200).json(req.username);   // Username is attached to the request in the verifyToken middleware

});

// If the PORT environment variable is not set in the computer, then use port 3000 by default
app.listen(process.env.PORT || 8081, () => {
    console.log(`api is running on port ${process.env.PORT || 8081}`);
});



