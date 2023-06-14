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
    origin: ['*'],
    methods: ['*'],
    allowedHeaders: ['*'],
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

  socket.on('client:connect',(aa)=>{
    console.log('client connected')
  })
  socket.on('server:connect',()=>{
    console.log('server connected')
  })
  
  socket.on('client:offer',(clientOffer)=>{
    console.log('client offer')
    io.emit('client:offer:incoming', clientOffer)
  })

  socket.on('server:client:answer',(serverAns)=>{
    console.log('server answer received')
    io.emit('server:ans:client',serverAns)
  })


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
