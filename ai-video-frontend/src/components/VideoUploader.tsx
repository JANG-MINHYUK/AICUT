import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const UploadContainer = styled.div`
  border: 2px dashed #ccc;
  border-radius: 4px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    border-color: #4CAF50;
  }
`;

const UploadText = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin: 0;
`;

const FileName = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #333;
`;

interface VideoUploaderProps {
  onFileUpload: (file: File) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv']
    },
    maxFiles: 1
  });

  return (
    <UploadContainer {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <UploadText>여기에 비디오 파일을 드롭하세요...</UploadText>
      ) : (
        <UploadText>비디오 파일을 드래그하거나 클릭하여 업로드하세요</UploadText>
      )}
      {acceptedFiles.length > 0 && (
        <FileName>
          선택된 파일: {acceptedFiles[0].name}
        </FileName>
      )}
    </UploadContainer>
  );
};

export default VideoUploader; 