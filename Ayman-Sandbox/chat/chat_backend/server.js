import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import {Server} from "socket.io";


const app = express();
app.use(express.json());   // If this is not included, then we will not be able to read json sent in request body
app.use(cors());  ///// If program doesn't work it could be because I excluded stuff inside cors
                    // If this is not included, then the frontend will not be able to recieve responses from the api
                    // because the browsers will not allow it.

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    const username = socket.handshake.auth.username;
    console.log(`${username} has connected`);
    socket.join(username);

    // We can use anything besides 'message' as well. The message variable can be a javascript object or a string
    socket.on('message', (message) =>     {   
        console.log(message);
        io.to(message.recipientUsername).emit('message', `${username} said ${message.message}` );
        //io.emit('message', `${username} said ${message.message}` );   
    });
});

app.get('/', (req, res) => {
    res.json("The api still works when we run server instead of app!");
}); 

// If the PORT environment variable is not set in the computer, then use port 3000 by default
server.listen(process.env.PORT || 3001, () => {
    console.log(`api is running on port ${process.env.PORT || 3001}`);
});
