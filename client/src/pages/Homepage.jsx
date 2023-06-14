import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

const Homepage = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/room");
  };

  const handleShow = () => {
    navigate("/feed");
  };

  return (
    <Box padding={"3rem"}>
      <Typography variant="h1" textAlign={"center"} marginBottom={"2rem"}>
        Welcome to InspireFeed
      </Typography>

      <Box
        display={"flex"}
        justifyContent={"space-around"}
        margin={"1rem"}
        padding={"2rem"}
      >
        <Button onClick={handleCreate} variant="contained">Create New Meeting</Button>
        <Button variant="outlined" onClick={handleShow}>
          Show My Feed
        </Button>
      </Box>
    </Box>
  );
};

export default Homepage;
