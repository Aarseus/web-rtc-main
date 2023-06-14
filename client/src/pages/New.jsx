import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";

var config = {
  sdpSemantics: "unified-plan",
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
};
var myPeerConnection = new RTCPeerConnection(config);

const New = () => {
  const socket = useSocket();
  const [localDescriptionStatus, setLocalDescriptionStatus] = useState(false);
  const [remoteAns, setRemoteAns] = useState(null);
  const handleSendOffer = async () => {
    window.onbeforeunload = () => {
      myPeerConnection.close();
      myPeerConnection = null;
      axios.post("/close_connection", 1);
    };

    myPeerConnection.addTransceiver("video", {
      direction: "recvonly",
    });

    myPeerConnection.createOffer().then((offer) => {
      myPeerConnection.setLocalDescription(offer);
      socket.emit("client:offer", offer);
    });
  };

  useEffect(() => {
    if (myPeerConnection.iceGatheringState === "complete") {
    } else {
      function checkState() {
        if (myPeerConnection.iceGatheringState === "complete") {
          myPeerConnection.removeEventListener(
            "icegatheringstatechange",
            checkState
          );
        }
      }
      myPeerConnection.addEventListener("icegatheringstatechange", checkState);
    }
  }, [myPeerConnection]);

  const handleSetAnswer = () => {
    myPeerConnection.setRemoteDescription(remoteAns);
  };

  useEffect(() => {
    myPeerConnection.addEventListener("track", function (evt) {
      if (evt.track.kind == "video") {
        console.log('tracks streams', evt.streams[0])
        document.getElementById("video").srcObject = evt.streams[0];
      }
    });
  }, [myPeerConnection, socket, handleSetAnswer]);

  const handleAnsReceived = useCallback(
    async (ans) => {
      console.log("ashish is awesome", ans);
      setRemoteAns(ans);
    },
    [myPeerConnection, localDescriptionStatus]
  );

  useEffect(() => {
    socket.on("server:ans:client", handleAnsReceived);
    return () => {
      socket.on("server:ans:client", handleAnsReceived);
    };
  }, [socket]);

  return (
    <div>
      <video id="video" controls muted autoPlay></video>
      <button onClick={handleSendOffer}>Send Offer</button>
      <button onClick={handleSetAnswer}>Set Answer</button>
    </div>
  );
};

export default New;
export { New };
