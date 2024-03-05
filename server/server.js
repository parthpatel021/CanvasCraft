import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import socketHandler from './socketHandler.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
const httpServer  = http.createServer(app);

socketHandler(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`);
})
