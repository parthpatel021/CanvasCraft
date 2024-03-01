import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 8080;
const CLIENTURL = process.env.CLIENTURL;

const app = express();
const httpServer  = http.createServer(app);

app.use(cors());

const io = new Server(httpServer , {
    cors: {
      origin: CLIENTURL,
      methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(socket.id);
})


httpServer .listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`);
})
