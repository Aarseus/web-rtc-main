const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: true
});
const port = 8000; // Replace with your desired port number


const emailToSocketIdMap = new Map();
const socketIdEmailMap = new Map();


app.use(express.json());

// Define Socket.IO connection
io.on('connection', (socket) => {
  // Handle the 'connectToServer' event
  socket.on('room:join', (data) => {
    const { emailId, roomId } = data;
    emailToSocketIdMap.set(emailId, socket.id)
    socketIdEmailMap.set(socket.id, emailId);
    socket.emit("room:join", { emailId, id: socket.id })
    io.to(roomId).emit("user:joined", { emailId, id: socket.id })
    socket.join(roomId);
    io.to(socket.id).emit('room:join', data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on('call:accepted', ({ to, ans }) => {
    io.to(to).emit('call:accepted', { from: socket.id, ans })
  });

  socket.on('peer:nego:needed', ({ to, offer }) => {
    io.to(to).emit('peer:nego:needed', { from: socket.id, offer })
  });

  socket.on('peer:nego:done', ({ to, ans }) => {
    io.to(to).emit('peer:nego:final', { from: socket.id, ans })
  });

});


// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
