import whisper
import os
from moviepy.editor import VideoFileClip

def extract_audio(video_path):
    """비디오에서 오디오를 추출합니다."""
    video = VideoFileClip(video_path)
    audio_path = video_path.rsplit('.', 1)[0] + '.wav'
    video.audio.write_audiofile(audio_path)
    return audio_path

def transcribe_audio(video_path):
    """Whisper를 사용하여 오디오를 텍스트로 변환합니다."""
    # 오디오 추출
    audio_path = extract_audio(video_path)
    
    # Whisper 모델 로드
    model = whisper.load_model("base")
    
    # 오디오 변환
    result = model.transcribe(audio_path)
    
    # SRT 파일 생성
    srt_path = video_path.rsplit('.', 1)[0] + '.srt'
    with open(srt_path, 'w', encoding='utf-8') as f:
        for i, segment in enumerate(result['segments'], 1):
            start = segment['start']
            end = segment['end']
            text = segment['text'].strip()
            
            # 시간 형식 변환 (초 -> SRT 시간 형식)
            start_time = format_time(start)
            end_time = format_time(end)
            
            f.write(f"{i}\n")
            f.write(f"{start_time} --> {end_time}\n")
            f.write(f"{text}\n\n")
    
    # 임시 오디오 파일 삭제
    os.remove(audio_path)
    
    return srt_path

def format_time(seconds):
    """초를 SRT 시간 형식으로 변환합니다."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = seconds % 60
    milliseconds = int((seconds - int(seconds)) * 1000)
    return f"{hours:02d}:{minutes:02d}:{int(seconds):02d},{milliseconds:03d}" 