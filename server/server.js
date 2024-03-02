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

    socket.on('createElement', (element, room) => {
        socket.to(room).emit('createElement', element);
    });
    socket.on('updateElement', (element, room) => {
        socket.to(room).emit('updateElement', element);
    });

    socket.on('join', room => {
        socket.join(room);
    })
})


httpServer.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`);
})
