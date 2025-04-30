from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
from werkzeug.utils import secure_filename

from utils.whisper_transcriber import transcribe_audio
from utils.background_remover import BackgroundRemover
from utils.silence_editor import remove_silence, split_on_silence, zip_segments

UPLOAD_FOLDER = 'uploads'
AUDIO_FOLDER = os.path.join(UPLOAD_FOLDER, 'audio')
PROCESSED_FOLDER = os.path.join(UPLOAD_FOLDER, 'processed')
SUBTITLES_FOLDER = os.path.join(UPLOAD_FOLDER, 'subtitles')

ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv'}

app = Flask(__name__)

# 설정은 app 객체 생성 후에 진행해야 합니다
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['AUDIO_FOLDER'] = AUDIO_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['SUBTITLES_FOLDER'] = SUBTITLES_FOLDER

CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from all origins

# 필요한 폴더 생성
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(SUBTITLES_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': '파일이 요청에 없습니다.'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': '파일이 선택되지 않았습니다.'}), 400

    if file and allowed_file(file.filename):
        timestamp = int(time.time())
        original_filename = secure_filename(file.filename)
        base_name = os.path.splitext(original_filename)[0]
        unique_filename = f"{base_name}_{timestamp}"
        
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_filename}{os.path.splitext(original_filename)[1]}")
        file.save(save_path)

        try:
            processed_video = save_path  # 원본 그대로 사용

            # Whisper로 자막 생성
            subtitles_path = transcribe_audio(processed_video)

            # remove_background 옵션 확인
            remove_bg = request.form.get('remove_background') == 'true'
            if remove_bg:
                remover = BackgroundRemover()
                processed_video = remover.remove_background(processed_video)

            processed_filename = os.path.basename(processed_video)
            subtitles_filename = os.path.basename(subtitles_path)

            base_url = request.host_url.rstrip('/')

            return jsonify({
                'message': '파일 처리 완료',
                'videoUrl': f'{base_url}/processed/{processed_filename}',
                'subtitlesUrl': f'{base_url}/subtitles/{subtitles_filename}',
                'fileName': os.path.splitext(processed_filename)[0]
            })

        except Exception as e:
            print(f"Error processing video: {e}")
            return jsonify({'error': '서버 처리 중 오류 발생'}), 500

    return jsonify({'error': '허용되지 않는 파일 형식입니다.'}), 400

@app.route('/process', methods=['POST'])
def process_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video = request.files['video']
    mode = request.form.get('mode', 'remove')

    filename = secure_filename(video.filename)
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    video.save(video_path)

    base_url = request.host_url.rstrip('/')

    if mode == 'remove':
        output_path = os.path.join(app.config['PROCESSED_FOLDER'], f"removed_{filename}")
        remove_silence(video_path, output_path)
        return jsonify({
            "original_url": f"{base_url}/uploads/{filename}",
            "processed_url": f"{base_url}/processed/removed_{filename}",
        })

    elif mode == 'split':
        output_dir = os.path.join(app.config['PROCESSED_FOLDER'], f"split_{os.path.splitext(filename)[0]}")
        segments = split_on_silence(video_path, output_dir)

        if not segments:
            return jsonify({
                "original_url": f"{base_url}/uploads/{filename}",
                "segments": [],
                "zip_url": None
            })

        # ZIP으로 묶기
        zip_path = f"{output_dir}.zip"
        zip_segments(output_dir, zip_path)

        segment_urls = [f"{base_url}/processed/{os.path.basename(p)}" for p in segments]
        zip_url = f"{base_url}/processed/{os.path.basename(zip_path)}"

        return jsonify({
            "original_url": f"{base_url}/uploads/{filename}",
            "segments": segment_urls,
            "zip_url": zip_url
        })

    else:
        return jsonify({'error': 'Invalid mode provided'}), 400

@app.route('/api/status', methods=['GET'])
def api_status():
    return jsonify({"status": "Server is running", "timestamp": time.time()})

if __name__ == '__main__':
    app.run(debug=True)
