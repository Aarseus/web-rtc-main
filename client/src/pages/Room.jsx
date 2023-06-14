import ReactPlayer from "react-player";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import peer from "../service/createPeer";
import { useSocket } from "../context/SocketProvider";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [remoteUser, setRemoteUser] = useState(null);

  const handleUserJoined = useCallback(({ id, email }) => {
    setRemoteSocketId(id);
    setRemoteUser(email);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      console.log('this is offer',offer)
      console.log('this is asnwededwc', ans)
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, [sendStreams]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const handleCloseCall = () => {
    setMyStream(null);
  };
  const handleSubmit = () => {
    socket.emit("room:join", { emailId: userEmail, roomId: 12 });
    setRoomVisible(true);
  };
  const [userEmail, setUserEmail] = useState(null);
  const [roomVisible, setRoomVisible] = useState(false);
  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
  };
  return (
    <>
      <Box sx={{ padding: "3rem" }}>
        <Typography variant="h5" textAlign={"center"}>
          Submit Your Email to join room
        </Typography>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
            height: "5rem",
            justifyContent: "center",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            onChange={handleEmailChange}
          />
          <Button
            type="submit"
            // disabled={!userEmail?.length}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </FormControl>
      </Box>

      <Typography variant="h5" textAlign={"center"}>
        Participants in the room:
      </Typography>
      <Typography variant="h6" textAlign={"center"}>
        {userEmail ?? "0"}
      </Typography>
      {remoteUser && (
        <Typography variant="h6" textAlign={"center"}>
          {remoteUser}
        </Typography>
      )}

      {!!remoteSocketId && (
        <Box display="flex" justifyContent={"center"} margin={"20px auto"}>
          <Button
            onClick={handleCallUser}
            variant="contained"
            // disabled={!remoteUser}
          >
            Start Call
          </Button>
        </Box>
      )}

      {!!myStream && (
        <Box border={"1px solid black"}>
          <Typography variant="h4">Your Video</Typography>
          <ReactPlayer
            height={"100px"}
            width={"300px"}
            playing
            muted
            url={myStream}
          />
          <Button onClick={sendStreams}>Send Stream</Button>
          <Button color="warning" onClick={handleCloseCall}>
            Close
          </Button>
        </Box>
      )}
      {!!remoteStream && (
        <Box border={"1px solid black"}>
          <Typography variant="h4">Their Video</Typography>
          <ReactPlayer
            height={"300px"}
            width={"500px"}
            playing
            muted
            url={remoteStream}
          />
          <Button color="warning" onClick={() => setRemoteStream(null)}>
            Close
          </Button>
        </Box>
      )}
    </>
  );
};

export default Room;
export { Room };
