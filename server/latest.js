const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const Stream = require('node-rtsp-stream');
const cors = require('cors');
const fs=require('fs');

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

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
// Create a WebSocket server

// Handle WebSocket connection
io.on('connection', (socket) => {
    socket.on('latest', () => {
        console.log('aashish')
        // const stream = new Stream({
        //     name: 'name',
        //     streamUrl: 'rtsp://admin:Nepal@123@192.168.1.64:554/Streaming/channels/101',
        //     wsPort: 8080,
        //     ffmpegOptions: { // options ffmpeg flags
        //         '-stats': '', // an option with no neccessary value uses a blank string
        //         '-r': 30 // options with required values specify the value after the key
        //     }
        // })
        // const stream="this is the one"
        socket.emit('latest:video')
    })
    socket.on('close',()=>{
        console.log('diconnection')
        socket.disconnect();
        console.log('here')
    })

});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
