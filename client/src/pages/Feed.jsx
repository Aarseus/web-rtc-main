import React from 'react'
import ReactPlayer from 'react-player';

const Feed = () => {
    var pc = null;
    // define negotiate function
    function negotiate() {
        pc.addTransceiver('video', {
            direction: 'recvonly'
        });
        return pc.createOffer().then(function (offer) {
            console.log('offer', offer);
            return pc.setLocalDescription(offer);
        }).then(function () {
            // wait for ICE gathering to complete
            return new Promise(function (resolve) {
                if (pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    function checkState() {
                        if (pc.iceGatheringState === 'complete') {
                            // remove `icegatheringstatechange` event listener
                            pc.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    }
                    // add `icegatheringstatechange` event listener
                    pc.addEventListener('icegatheringstatechange', checkState);
                }
            });
        }).then(function () {
            var offer = pc.localDescription;
            return fetch('http://192.168.1.91:8000/offer', {
                body: JSON.stringify({
                    sdp: offer.sdp,
                    type: offer.type,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
        }).then(function (response) {
            // return response
            return response.json();
        }).then(function (answer) {
            // return session description as the 
            // remote peer's current answer. 
            return pc.setRemoteDescription(answer);
        }).catch(function (e) {
            // catch any errors.
            alert(e);
        });
    }
    // add configs
    var config = {
        sdpSemantics: 'unified-plan'
    };

    config.iceServers = [{
        urls: ['stun:stun.l.google.com:19302']
    }];
    pc = new RTCPeerConnection(config);
    pc.addEventListener('track', function (evt) {
        if (evt.track.kind == 'video') {
            document.getElementById('video').srcObject = evt.streams[0];
        }
    });
    negotiate();
    window.onbeforeunload = function (event) {
        pc.close();
        pc = null;
        axios.post('/close_connection', 1);
    };
    return (
        <html>
            <body class="bodycontainer">
                <video id="video" class="embed-responsive-item" autoplay="true" playsinline="true" controls="true" muted="true"></video>
            </body>
        </html>
    )
}

export default Feed