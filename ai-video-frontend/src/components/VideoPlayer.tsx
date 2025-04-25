import React from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  margin: 1rem 0;
  background-color: #000;
  border-radius: 4px;
  overflow: hidden;
`;

interface VideoPlayerProps {
  file: File;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ file }) => {
  const videoUrl = URL.createObjectURL(file);

  return (
    <PlayerContainer>
      <ReactPlayer
        url={videoUrl}
        controls
        width="100%"
        height="auto"
        style={{ aspectRatio: '16/9' }}
      />
    </PlayerContainer>
  );
};

export default VideoPlayer; 