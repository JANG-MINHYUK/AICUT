from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from utils.whisper_transcriber import transcribe_audio
from utils.video_processor import process_video
from utils.background_remover import remove_background
import time

app = Flask(__name__)
CORS(app)

# 업로드된 파일을 저장할 디렉토리
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB 제한

# === [1] 결과 파일 저장 폴더 자동 생성 ===
PROCESSED_FOLDER = 'processed'
SUBTITLES_FOLDER = 'subtitles'

os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(SUBTITLES_FOLDER, exist_ok=True)

# === [2] 저장된 파일 서빙 API ===
@app.route('/processed/<filename>')
def serve_processed_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

@app.route('/subtitles/<filename>')
def serve_subtitle_file(filename):
    return send_from_directory(SUBTITLES_FOLDER, filename)

ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # 고유한 파일명 생성 (타임스탬프 + 원본 파일명)
        timestamp = int(time.time())
        original_filename = secure_filename(file.filename)
        base_name = os.path.splitext(original_filename)[0]
        unique_filename = f"{base_name}_{timestamp}"
        
        # 원본 파일 저장
        original_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_filename}{os.path.splitext(original_filename)[1]}")
        file.save(original_path)
        
        # 비디오 처리 시작
        try:
            # 무음 구간 자동 컷
            processed_video = process_video(original_path)
            
            # 자막 생성
            subtitles = transcribe_audio(processed_video)
            
            # 배경 제거 (선택적)
            if request.form.get('remove_background') == 'true':
                processed_video = remove_background(processed_video)
            
            return jsonify({
                'message': 'File processed successfully',
                'videoUrl': f'/processed/{unique_filename}.mp4',
                'subtitlesUrl': f'/subtitles/{unique_filename}.srt',
                'fileName': unique_filename
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000) 