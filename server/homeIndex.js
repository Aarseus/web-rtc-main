const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const NodeMediaServer = require('node-media-server');
const ss = require('socket.io-stream');

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
const cameraList = ['video1', 'video2', 'video3'];
const videoPath = path.join(__dirname, 'public', 'video.mp4');


app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// socket request
io.on('connection', (socket) => {
    socket.on('get:cameraList', () => {
        socket.emit('send:cameraList', cameraList)
    })

    socket.on('choosed:camera', () => {
        const videoFile=fs.createReadStream(videoPath);
        videoFile.on('data',(chunk)=>{
            socket.send(chunk)
        })
        // socket.emit('send:stream', vid);
    });

});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
