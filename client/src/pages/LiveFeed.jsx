import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ReactPlayer from "react-player";
import { makeTracks } from "../service/makeTracks";

const LiveFeed = () => {
  const [cameraList, setCameraList] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [localId, setLocalId] = useState(null);
  const [remoteId, setRemoteId] = useState(null);

  const ws = useSocket();

  const handleVideoPlayClick = () => {
    ws.emit("get:video");
  };

  const getCameraList = () => {
    ws.emit("camera:list");
  };

  const handleCameraChoosed = (e) => {
    ws.emit("camera:choosed", e);
  };

  const handleCameraList = (e) => {
    setCameraList(e);
  };

  const handleStream = (stream) => {
    // navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      // .then((userStream) => {console.log('media stream',userStream.getTracks())})
    //     setLocalId(userStream);
  //  console.log('aaaaaaa', fs.createWriteStream(stream)    ) 
        setRemoteId(stream);
        const client = new RTCPeerConnection();
        const server = new RTCPeerConnection();
        console.log('streams',makeTracks(stream))
        setVideoUrl(makeTracks(stream))
        // stream.getTracks().forEach((track) => {
        //   server.addTrack(track, stream);
        // });

        client.onicecandidate = (e) => {
          server.addIceCandidate(e.candidate);
        };
        server.onicecandidate = (e) => {
          client.addIceCandidate(e.candidate);
        };

        client.createOffer()
          .then((offer) => {
            return client.setLocalDescription(offer);
          })
          .then(() => {
            server.setRemoteDescription(client.localDescription);
            return server.createAnswer();
          })
          .then((answer) => {
            return server.setLocalDescription(answer);
          })
          .then(() => {
            client.setRemoteDescription(server.localDescription);
          })
          .catch((error) => {
            console.error("Error creating WebRTC offer/answer: ", error);
          });
      // })
      // .catch((error) => {
      //   console.error("Error accessing user media: ", error);
      // });
  };

  useEffect(() => {
    ws.on("camera:list:all", handleCameraList);
    ws.on("local", handleStream);

    return () => {
      ws.off("camera:list:all", handleCameraList);
      ws.off("local", handleStream);
    };
  }, [ws]);

console.log('videourl', videoUrl)

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h3" textAlign="center" marginBottom={"1rem"}>
        Your Feed
      </Typography>
      <Button
        onClick={getCameraList}
        variant="contained"
        sx={{ marginBottom: "1rem" }}
      >
        View Cameras
      </Button>
      {cameraList?.map((indvCamera) => (
        <Button
          onClick={() => handleCameraChoosed(indvCamera)}
          key={indvCamera}
        >
          {indvCamera}
        </Button>
      ))}
      <Button onClick={handleVideoPlayClick}>Play</Button>
      <ReactPlayer url={videoUrl} />
    </Box>
  );
};

export default LiveFeed;
