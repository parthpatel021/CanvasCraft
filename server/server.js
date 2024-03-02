import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 8080;
const CLIENTURL = 'http://localhost:3000/';

const app = express();
app.use(cors());
const httpServer  = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
});

io.on('connection', (socket) => {

    socket.on('elements', (elements, room) => {
        socket.to(room).emit('receive-elements', elements);
    });

    socket.on('join', room => {
        socket.join(room);
    })
})


httpServer.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`);
})
