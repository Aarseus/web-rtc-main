export function makeTracks(videoData) {
    console.log('video data', videoData)
    const blob = new Blob([videoData], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(blob);
    return videoUrl
  }
  