import React from 'react';
import VideoPlayer from './VideoPlayer';

type ResultSectionProps = {
  videoUrls: {
    original?: string;
    cut?: string;
    bgRemoved?: string;
    subtitled?: string;
  };
};

const ResultSection: React.FC<ResultSectionProps> = ({ videoUrls = {} }) => {
  const renderSection = (title: string, url?: string) => {
    if (!url) return null;

    return (
      <div className="my-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <VideoPlayer videoUrl={url} />
        <a
          href={url}
          download
          className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          다운로드
        </a>
      </div>
    );
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      {renderSection('① 원본 영상', videoUrls.original)}
      {renderSection('② 무음 컷 편집 영상', videoUrls.cut)}
      {renderSection('③ 배경제거 영상', videoUrls.bgRemoved)}
      {renderSection('④ 자막삽입 영상', videoUrls.subtitled)}
    </div>
  );
};

export default ResultSection;