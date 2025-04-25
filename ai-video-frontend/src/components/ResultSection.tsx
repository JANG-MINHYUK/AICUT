import React, { useState } from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';

const ResultContainer = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  padding: 1rem;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const DownloadButton = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-right: 1rem;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const PlayerContainer = styled.div`
  margin: 1rem 0;
  background-color: #000;
  border-radius: 4px;
  overflow: hidden;
`;

interface ResultSectionProps {
  result: {
    videoUrl: string;
    subtitlesUrl: string;
    fileName: string;
  } | null;
}

const ResultSection: React.FC<ResultSectionProps> = ({ result }) => {
  const [resultFileName, setResultFileName] = useState<string | null>(null);

  // result가 변경될 때마다 파일명 업데이트
  React.useEffect(() => {
    if (result?.fileName) {
      setResultFileName(result.fileName);
    }
  }, [result]);

  if (!result) {
    return (
      <ResultContainer>
        <Title>처리 결과</Title>
        <p>비디오를 업로드하고 처리 버튼을 클릭하세요.</p>
      </ResultContainer>
    );
  }

  if (result.error) {
    return (
      <ResultContainer>
        <Title>처리 결과</Title>
        <ErrorMessage>{result.error}</ErrorMessage>
      </ResultContainer>
    );
  }

  return (
    <ResultContainer>
      <Title>처리 결과</Title>
      
      {result.videoUrl && (
        <>
          <PlayerContainer>
            <ReactPlayer
              url={result.videoUrl}
              controls
              width="100%"
              height="auto"
              style={{ aspectRatio: '16/9' }}
            />
          </PlayerContainer>
          
          <div>
            <DownloadButton href={result.videoUrl} download>
              비디오 다운로드
            </DownloadButton>
            
            {result.subtitlesUrl && (
              <DownloadButton href={result.subtitlesUrl} download>
                자막 다운로드
              </DownloadButton>
            )}
          </div>
        </>
      )}

      {resultFileName && (
        <div className="flex flex-col gap-2 mt-4">
          <a
            href={`http://localhost:5000/processed/${resultFileName}.mp4`}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              🎬 결과 영상 다운로드
            </button>
          </a>
          <a
            href={`http://localhost:5000/subtitles/${resultFileName}.srt`}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              📝 자막 파일 다운로드
            </button>
          </a>
        </div>
      )}
    </ResultContainer>
  );
};

export default ResultSection; 