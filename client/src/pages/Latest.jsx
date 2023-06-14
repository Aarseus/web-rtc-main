// Latest.js

import React, { useCallback, useEffect, useState } from "react";
// import { useSocket } from "../context/SocketProvider";
import { Box, Button, Typography } from "@mui/material";
// import io from "socket.io-client";
import ReactPlayer from "react-player";

const socket = new WebSocket('wss://localhost:8000');

const Latest = () => {

  useEffect(()=>{
    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };
    
    socket.onmessage = (event) => {
      // Process received video stream data
      const videoStreamData = event.data;
      // Process and render the video stream data here
      console.log('this is data', videoStreamData)
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
  },[socket])


  return (
    <Box>
      <Typography variant="h1" textAlign={"center"}>
        Your Live Feed
      </Typography>
      <Box
        border={"1px solid black"}
        sx={{ width: "80%", height: "50rem", margin: "auto" }}
      >
        <ReactPlayer
          url={"ws://localhost:9999"}
          height={"100%"}
          width={"100%"}
        />
      </Box>
    </Box>
  );
};

export default Latest;
