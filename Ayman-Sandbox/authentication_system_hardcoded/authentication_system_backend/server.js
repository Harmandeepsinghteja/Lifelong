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


// Note: we do not need to implement a logout endpoint in the server.
// To log out, all the frontend needs to do is delete the token from localstorage and refresh the page.
app.post('/login', (req, res, next) => {
    const loginIsSuccessful = true;
    if (loginIsSuccessful) {
        // Generate the token and send it to the user
        const token = jwt.sign({username: 'user1'}, SECRET_KEY);
        res.json({token: token});
    }
});

app.get('/name', (req, res, next) => {
    const token = req.headers.token;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json('Invalid token, cannot be decrypted');
        }
        else {
            req.username = decoded.username;
            res.status(200).json(req.username);
        }
    });

});

// If the PORT environment variable is not set in the computer, then use port 3000 by default
app.listen(process.env.PORT || 8081, () => {
    console.log(`api is running on port ${process.env.PORT || 8081}`);
});



