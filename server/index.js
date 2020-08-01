const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

const {addUser, removeUser, getUser, getUserInRoom } = require('./users');

io.on('connection', (socket) =>{
    console.log('we have a new connection!!!!');
    
    socket.on('disconnect', ()=>{
        console.log('ohh no, user has left!!!');
    });
	socket.on('join', ({name, room}, callback)=>{
		console.log(name, room);
		
		const {error, user} = addUser({ id:socket.id, name, room });
		
		if(error) return callback(error);
		
		socket.emit('message', {user : 'admin', text: `${user.name}, welcome to ${user.room}`} );
		
		socket.broadcast.to(user.room).emit('message', {user : 'admin', text: `${user.name} joined the room`});
		
		socket.join(user.room);
		
		callback();
	});
	socket.on('sendMessage', ({message}, callback)=>{
		const user = getUser(socket.id);
		
		io.to(user.room).emit('message', {user: user.name, text: message} );
		
		callback();
	});
	
});

app.use(router);
server.listen(PORT, ()=> console.log(`server is running at ${PORT}`));