import React from 'react';

type ProcessingOptionsProps = {
  selectedMode: string;
  onModeChange: (mode: string) => void;
};

const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({
  selectedMode,
  onModeChange,
}) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2">처리 옵션 선택</h2>
      <div className="flex flex-col gap-2">
        <label className="flex items-center">
          <input
            type="radio"
            name="processingMode"
            value="remove"
            checked={selectedMode === 'remove'}
            onChange={() => onModeChange('remove')}
            className="mr-2"
          />
          무음 구간 제거 (컷 편집)
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="processingMode"
            value="split"
            checked={selectedMode === 'split'}
            onChange={() => onModeChange('split')}
            className="mr-2"
          />
          무음 구간 분할 (컷 나누기만)
        </label>
      </div>
    </div>
  );
};

export default ProcessingOptions;