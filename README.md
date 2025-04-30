# 🎬 AICUT - AI 기반 영상 편집 SaaS

> 누구나 쉽게 자동 영상 편집을!  
AI로 컷하다. **AICUT**

---

## 🧠 서비스 소개

**AICUT**은 AI를 기반으로 영상 편집을 자동화해주는 웹 SaaS 서비스입니다.  
크리에이터, 교육자, 마케터 모두를 위한 **빠르고 쉬운 영상 편집** 솔루션입니다.

---

## 🚀 주요 기능

- 🎬 **무음 구간 자동 컷 편집** (remove / split 모드 선택 가능)
- 🗣️ **Whisper 기반 자막 생성** (.srt)
- ✍️ **FFmpeg 기반 자막 임베딩 + 스타일 적용**
- 🧼 **Robust Video Matting (RVM) 기반 배경 제거**
- 💾 **편집된 영상 및 자막 다운로드 (mp4, srt)**

---

## 🛠️ 기술 스택

| 구성 | 기술 |
|------|------|
| 프론트엔드 | React + Vite + TypeScript |
| 백엔드 | Python + Flask |
| AI 모델 | Whisper + RVM |
| 배포 | Render (프론트/백 분리 배포) |
| 로그 추적 | Google Sheets + Apps Script |
| 대시보드 | Looker Studio |

---

## 🔗 주요 링크

| 이름 | 주소 |
|------|------|
| 백엔드 API | [https://ai-video-editor.onrender.com](https://ai-video-editor.onrender.com) |
| 데모 페이지 | [https://aicut.notion.site/aicut-demo](https://aicut.notion.site/aicut-demo) |
| UX 피드백 폼 | [Google Form](https://forms.gle/DW5qQBgxMirzoBrD6) |
| 사용자 대시보드 | [Looker Studio](https://lookerstudio.google.com/s/hEsWjJHix_c) |

---

## 📦 설치 및 실행 (로컬 테스트용)

```bash
# 프론트엔드 실행
cd ai-video-frontend
npm install
npm run dev

# 백엔드 실행
cd ai-video-editor
pip install -r requirements.txt
python app.py
```

---

## 🧪 테스트 방법

1. 브라우저에서 `http://localhost:3000`으로 접속합니다.
2. 비디오 파일을 업로드하고, 옵션을 선택한 뒤 "영상 처리 시작" 버튼을 클릭합니다.
3. 처리 결과를 확인하고, 다운로드 버튼을 눌러 결과물을 저장합니다.

---

## 🛠️ 개발 환경 설정

### 프론트엔드
- Node.js 16 이상 설치 필요
- `ai-video-frontend` 디렉토리에서 `npm install` 실행

### 백엔드
- Python 3.9 이상 설치 필요
- `ai-video-editor` 디렉토리에서 `pip install -r requirements.txt` 실행

---

## 📂 디렉토리 구조

```
ai-video-editor/
  app.py
  requirements.txt
  utils/
    background_remover.py
    video_processor.py
    whisper_transcriber.py
ai-video-frontend/
  index.html
  package.json
  vite.config.ts
  src/
    App.tsx
    components/
      VideoUploader.tsx
      VideoPlayer.tsx
      ProcessingOptions.tsx
      ResultSection.tsx
processed/
subtitles/
uploads/
```

---

## 📝 라이선스

MIT License