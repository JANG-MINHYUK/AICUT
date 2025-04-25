import React from 'react';
import styled from 'styled-components';

const OptionsContainer = styled.div`
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 4px;
  margin: 1rem 0;
`;

const OptionGroup = styled.div`
  margin-bottom: 1rem;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const OptionTitle = styled.span`
  font-weight: bold;
  color: #333;
`;

const OptionDescription = styled.p`
  margin: 0.25rem 0 0 1.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const RadioGroup = styled.div`
  margin-left: 1.5rem;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  cursor: pointer;
`;

interface ProcessingOptionsProps {
  options: {
    removeSilence: boolean;
    generateSubtitles: boolean;
    removeBackground: boolean;
    mode: 'remove' | 'split';
  };
  onChange: (options: {
    removeSilence: boolean;
    generateSubtitles: boolean;
    removeBackground: boolean;
    mode: 'remove' | 'split';
  }) => void;
}

const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({ options, onChange }) => {
  const handleOptionChange = (key: keyof typeof options, value: boolean | 'remove' | 'split') => {
    onChange({
      ...options,
      [key]: value
    });
  };

  return (
    <OptionsContainer>
      <OptionGroup>
        <OptionLabel>
          <Checkbox
            type="checkbox"
            checked={options.removeSilence}
            onChange={(e) => handleOptionChange('removeSilence', e.target.checked)}
          />
          <OptionTitle>무음 구간 자동 컷</OptionTitle>
        </OptionLabel>
        <OptionDescription>
          비디오에서 긴 무음 구간을 자동으로 제거합니다.
        </OptionDescription>
        <RadioGroup>
          <RadioOption>
            <input
              type="radio"
              name="mode"
              value="remove"
              checked={options.mode === 'remove'}
              onChange={() => handleOptionChange('mode', 'remove')}
            />
            <span>무음 구간 제거</span>
          </RadioOption>
          <RadioOption>
            <input
              type="radio"
              name="mode"
              value="split"
              checked={options.mode === 'split'}
              onChange={() => handleOptionChange('mode', 'split')}
            />
            <span>무음 구간에서 분할</span>
          </RadioOption>
        </RadioGroup>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>
          <Checkbox
            type="checkbox"
            checked={options.generateSubtitles}
            onChange={(e) => handleOptionChange('generateSubtitles', e.target.checked)}
          />
          <OptionTitle>자막 생성</OptionTitle>
        </OptionLabel>
        <OptionDescription>
          Whisper AI를 사용하여 자동으로 자막을 생성합니다.
        </OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>
          <Checkbox
            type="checkbox"
            checked={options.removeBackground}
            onChange={(e) => handleOptionChange('removeBackground', e.target.checked)}
          />
          <OptionTitle>배경 제거</OptionTitle>
        </OptionLabel>
        <OptionDescription>
          RVM AI를 사용하여 비디오의 배경을 제거합니다.
        </OptionDescription>
      </OptionGroup>
    </OptionsContainer>
  );
};

export default ProcessingOptions; 