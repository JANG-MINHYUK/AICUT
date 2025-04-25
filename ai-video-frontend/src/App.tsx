import React, { useState } from 'react';
import styled from 'styled-components';
import VideoUploader from './components/VideoUploader';
import VideoPlayer from './components/VideoPlayer';
import ProcessingOptions from './components/ProcessingOptions';
import ResultSection from './components/ResultSection';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.2rem;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [processingOptions, setProcessingOptions] = useState({
    removeSilence: true,
    generateSubtitles: true,
    removeBackground: false,
    mode: 'remove' as 'remove' | 'split'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    videoUrl?: string;
    subtitlesUrl?: string;
    error?: string;
  } | null>(null);

  const handleFileUpload = (file: File) => {
    setVideoFile(file);
    setResult(null);
  };

  const handleProcess = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('remove_background', processingOptions.removeBackground.toString());

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: '처리 중 오류가 발생했습니다.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppContainer>
      <Header>
        <Title>🎬 AICUT</Title>
        <Subtitle>AI로 쉽고 빠르게 영상을 편집하세요</Subtitle>
      </Header>

      <MainContent>
        <div>
          <VideoUploader onFileUpload={handleFileUpload} />
          {videoFile && (
            <>
              <VideoPlayer file={videoFile} />
              <ProcessingOptions
                options={processingOptions}
                onChange={setProcessingOptions}
              />
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '1rem',
                }}
              >
                {isProcessing ? '처리 중...' : '영상 처리 시작'}
              </button>
            </>
          )}
        </div>

        <ResultSection result={result} />
      </MainContent>
    </AppContainer>
  );
};

export default App; 