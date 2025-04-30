import React from 'react';

type VideoPlayerProps = {
  videoUrl: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  if (!videoUrl) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <video
        src={videoUrl}
        controls
        className="w-full rounded-lg shadow-lg"
      />
    </div>
  );
};

export default VideoPlayer;