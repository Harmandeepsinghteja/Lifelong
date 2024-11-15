import express from "express";
import cors from "cors";
import { createServer } from "node:http";

import setUpSocket from "./src/config/socketConnection.js"
import bioRouter from "./src/routes/bio.js";
import { registerRouter, loginRouter, adminLoginRouter } from "./src/routes/authentication.js";
import { userMetadataRouter } from "./src/routes/userMetadata.js";
import { messageRouter } from "./src/routes/message.js";
import { currentMatchesRouter, matchUsersRouter, unmatchUsersRouter } from "./src/routes/match.js";

const app = express();
app.use(express.json()); // If this is not included, then we will not be able to read json sent in request body
app.use(cors()); // If this is not included, then the frontend will not be able to recieve responses from the api
// because the browsers will not allow it.

const server = createServer(app);
setUpSocket(server);

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/admin-login', adminLoginRouter);
app.use('/bio', bioRouter);
app.use('/user-metadata', userMetadataRouter);
app.use('/message-history-of-current-match', messageRouter);
app.use('/user-matches', currentMatchesRouter);
app.use('/match-users', matchUsersRouter);
app.use('/unmatch', unmatchUsersRouter)

// If the PORT environment variable is not set in the computer, then use port 3000 by default
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
