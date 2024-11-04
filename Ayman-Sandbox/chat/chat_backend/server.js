import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import {Server} from "socket.io";
import mysql from 'mysql';


const app = express();
app.use(express.json());   // If this is not included, then we will not be able to read json sent in request body
app.use(cors());  ///// If program doesn't work it could be because I excluded stuff inside cors
                    // If this is not included, then the frontend will not be able to recieve responses from the api
                    // because the browsers will not allow it.

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "lifelong_db",
});

const queryPromiseAdapter = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        }); 
    });
};

const queryPromiseAdapterWithPlaceholders = (sql, args) => {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        }); 
    });
};


// io.on('connection', (socket) => {
//     const username = socket.handshake.auth.username;
//     console.log(`${username} has connected`);
//     socket.join(username);

//     // We can use anything besides 'message' as well. The message variable can be a javascript object or a string
//     socket.on('message', (message) =>     {   
//         console.log(message);
//         io.to(message.recipientUsername).emit('message', `${username} said ${message.message}` );
//         //io.emit('message', `${username} said ${message.message}` );   
//     });
// });

const getCurrentDateTimeAsString = () => {
    var dateTime = new Date();
    dateTime = dateTime.getUTCFullYear() + '-' +
        ('00' + (dateTime.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + dateTime.getUTCDate()).slice(-2) + ' ' + 
        ('00' + dateTime.getUTCHours()).slice(-2) + ':' + 
        ('00' + dateTime.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + dateTime.getUTCSeconds()).slice(-2);
    return dateTime;
}

/*
The message object must be of the format:
{
    content: "..."
    matchedUsername: "..."
}
*/ 
io.on('connection', async (socket) => {    
    socket.username = socket.handshake.auth.username;
    socket.join(socket.username);
    socket.on('message', async (message) => {
        console.log(message)
        try {
            // Get current match id of user
            var sql = `
                SELECT user_match.id
                FROM user_match
                JOIN users on users.id = user_match.userId
                WHERE users.username = '${socket.username}' AND user_match.unmatchedTime IS NULL`;
            
            var result = await queryPromiseAdapter(sql);
            if (result.length === 0) {
                return new Error('Could not find current match id of user');
            }
            const matchId = result[0].id;

            // Insert the message into the message table
            const createdTime = getCurrentDateTimeAsString();
            sql =  `INSERT INTO message (matchId, content, createdTime)
                VALUES (?, ?, ?);`;
            result = await queryPromiseAdapterWithPlaceholders(sql, [matchId, message.content, createdTime]);
            
            // Emit the message to the matched user
            io.to(message.matchedUsername).emit('message', message.content );
        }
        catch (err) {
            console.log(err)
            return err;
        }
        
    });
});

app.get('/', (req, res) => {
    res.json("The api still works when we run server instead of app!");
}); 

// If the PORT environment variable is not set in the computer, then use port 3000 by default
server.listen(process.env.PORT || 3001, () => {
    console.log(`api is running on port ${process.env.PORT || 3001}`);
});
