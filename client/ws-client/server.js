import Stream from 'node-rtsp-stream'

const stream = new Stream({
  name: 'name',
  streamUrl: 'rtsp://admin:Nepal@123@192.168.1.64:554/Streaming/channels/101',
  wsPort: 9999,
  ffmpegOptions: { // options ffmpeg flags
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': 30 // options with required values specify the value after the key
  }
})
    