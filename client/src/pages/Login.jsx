import { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketProvider";

const Login = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [loginDetails, setLoginDetails] = useState({
    emailId: "",
    roomId: "",
  });

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", loginDetails);
    },
    [loginDetails, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { id } = data;
      navigate(`/room/${id}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  const handleChange=(e)=>{
    const { name,value } = e.target;
    setLoginDetails(prev=>({...prev,[name]:value}))
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "98vh",
        backgroundColor: "#dfd4d9",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">Login</Typography>
        <TextField
          name="emailId"
          label="Email"
          variant="outlined"
          value={loginDetails.emailId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="roomId"
          label="Room Code"
          variant="outlined"
          value={loginDetails.roomCode}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Log In
        </Button>
      </form>
    </div>
  );
};

export default Login;
