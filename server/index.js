const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
});

const port = 8000;
const emailToSocketIdMap = new Map();
const socketIdEmailMap = new Map();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());


// socket request
io.on('connection', (socket) => {
  socket.on('room:join', (data) => {
    const { emailId, roomId } = data;
    emailToSocketIdMap.set(emailId, socket.id);
    socketIdEmailMap.set(socket.id, emailId);
    io.to(roomId).emit('user:joined', { emailId, id: socket.id });
    socket.join(roomId);
    io.to(socket.id).emit('room:join', data);
  });

  socket.on('server:user:call', ({ to, offer }) => {
    io.to(to).emit('incoming:call', { from: socket.id, offer });
  });

socket.on('offer:to:server',(offer)=>{
  setOffer(offer)
})

  socket.on('call:accepted', ({ to, ans }) => {
    io.to(to).emit('call:accepted', { from: socket.id, ans });
  });

  socket.on('peer:nego:needed', ({ to, offer }) => {
    io.to(to).emit('peer:nego:needed', { from: socket.id, offer });
  });

  socket.on('peer:nego:done', ({ to, ans }) => {
    io.to(to).emit('peer:nego:final', { from: socket.id, ans });
  });

});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
