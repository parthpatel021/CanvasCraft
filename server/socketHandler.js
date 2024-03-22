import { Server } from "socket.io";

export default function socketHandler(httpServer){
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
        socket.on('update', (element, room) => {
            socket.to(room).emit('update', element);
        });
    
        socket.on('join', room => {
            socket.join(room);
        })
    })
}