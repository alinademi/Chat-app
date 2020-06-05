const express = require('express');


const socketio = require('socket.io');
const http = require('http');

const cors = require('cors');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users')

const PORT = process.env.PORT || 5000;

const router = require('./router')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) =>{
    console.log("User connected!");

    socket.on('Join', ({ name, room}, callback)  => {
        console.log(name, room);

        // helper function to get
        const { error, user } = addUser({ id: socket.id, name, room });

        // callback error "username already exists" kicks out of function if error
        if(error) return callback(error);
        
        // emits message to user welcome to the room
        socket.emit('message', { user: "admit", text: `${user.name}, welcome to the room ${user.room}`});
        
        // braodcasts to everyone but the user that user has joined the room
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined.`});
        
        // joins user into room
        socket.join(user.room);

        io.to(user.room).emit('roomData', {room: user.room, users: getusersInRoom(user.room)})

        callback();
    });

    socket.on('sendMessage', (message, callback) =>{
        // get user that sends message
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user: user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, users: getusersInRoom(user.room)});
        callback();
    });

    socket.on('disconnect', () =>{
        console.log("User disconnected!");
    })

})

app.use(router);
app.use(cors());

server.listen(PORT, ()=> console.log(`Server started on port: ${PORT}`));
