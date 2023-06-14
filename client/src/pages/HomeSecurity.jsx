import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
// import peer from "../service/createPeer";

var config = {
  sdpSemantics: "unified-plan",
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
};
var myPeerConnection = new RTCPeerConnection(config);

const HomeSecurity = () => {
  const [clientOffer, setClientOffer] = useState(null);
  const [serverAns, setServerAns] = useState(null);
  const socket = useSocket();

  const handleOffer = useCallback(() => {
    myPeerConnection.addTransceiver("video", {
      direction: "recvonly",
    });
    myPeerConnection.createOffer().then((offer) => {
      setClientOffer(offer);
      myPeerConnection.setLocalDescription(offer);
      socket.emit("client:offer", offer);
    });
  }, []);

  const handleAnswer = useCallback((answer) => {
    //  console.log('answer:', answer)
    setServerAns(answer);
  }, []);

  const handleSetAnswer = () => {
    myPeerConnection.setRemoteDescription(serverAns);
    console.log(myPeerConnection);
  };

  useEffect(() => {
    socket.on("server:ans:client", handleAnswer);
  }, [socket]);

  useEffect(() => {
    myPeerConnection.addEventListener("track", function (evt) {
      if (evt.track.kind == "video") {
        document.getElementById("video").srcObject = evt.streams[0];
      }
    });
  }, [myPeerConnection]);

  return (
    <div>
      <button onClick={handleOffer}>Send offer</button>
      <button onClick={handleSetAnswer}>Get offer</button>
      <video id="video"></video>
    </div>
  );
};

export default HomeSecurity;
