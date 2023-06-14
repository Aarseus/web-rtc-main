// Front-end (React.js) - Try.js
import React, { useEffect, useRef } from 'react';
import JSMpegPlayer from 'jsmpeg-player';

const Try = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const player =  JSMpegPlayer('ws://localhost:8000/stream', {
      canvas: videoRef.current,
      autoplay: true,
    });

    return () => {
      player.destroy();
    };
  }, []);

  return <canvas ref={videoRef} />;
};

export default Try;
