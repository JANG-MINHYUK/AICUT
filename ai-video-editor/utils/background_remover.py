import torch
import torch.nn.functional as F
import numpy as np
import cv2
from moviepy.editor import VideoFileClip
import os

class BackgroundRemover:
    def __init__(self):
        # RVM 모델 로드
        self.model = torch.hub.load('PeterL1n/RobustVideoMatting', 'mobilenetv3')
        self.model = self.model.cuda() if torch.cuda.is_available() else self.model
        self.model.eval()
    
    def process_frame(self, frame):
        """단일 프레임의 배경을 제거합니다."""
        # 프레임 전처리
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = cv2.resize(frame, (512, 512))
        frame = torch.from_numpy(frame).permute(2, 0, 1).unsqueeze(0).float() / 255.0
        
        if torch.cuda.is_available():
            frame = frame.cuda()
        
        # 배경 제거
        with torch.no_grad():
            alpha = self.model(frame)[0]
        
        # 알파 마스크 후처리
        alpha = F.interpolate(alpha, size=(frame.shape[2], frame.shape[3]), mode='bilinear', align_corners=False)
        alpha = alpha.squeeze().cpu().numpy()
        
        return alpha
    
    def remove_background(self, video_path):
        """비디오의 배경을 제거합니다."""
        # 비디오 로드
        video = VideoFileClip(video_path)
        fps = video.fps
        
        # 출력 비디오 설정
        output_path = os.path.splitext(video_path)[0] + '_nobg.mp4'
        temp_dir = 'temp_frames'
        os.makedirs(temp_dir, exist_ok=True)
        
        # 프레임 단위로 처리
        processed_frames = []
        for i, frame in enumerate(video.iter_frames()):
            # 배경 제거
            alpha = self.process_frame(frame)
            
            # 알파 채널이 있는 프레임 생성
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGRA)
            frame[:, :, 3] = (alpha * 255).astype(np.uint8)
            
            # 프레임 저장
            frame_path = os.path.join(temp_dir, f'frame_{i:04d}.png')
            cv2.imwrite(frame_path, frame)
            processed_frames.append(frame_path)
        
        # 처리된 프레임들을 비디오로 합치기
        frame = cv2.imread(processed_frames[0], cv2.IMREAD_UNCHANGED)
        height, width = frame.shape[:2]
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        for frame_path in processed_frames:
            frame = cv2.imread(frame_path, cv2.IMREAD_UNCHANGED)
            out.write(frame)
        
        out.release()
        
        # 임시 파일 정리
        for frame_path in processed_frames:
            os.remove(frame_path)
        os.rmdir(temp_dir)
        
        return output_path

def remove_background(video_path):
    """배경 제거 함수의 래퍼입니다."""
    remover = BackgroundRemover()
    return remover.remove_background(video_path) 