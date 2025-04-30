import React from "react";

type Props = {
  onFileChange: (file: File) => void;
};

const VideoUploader: React.FC<Props> = ({ onFileChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow bg-white">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        비디오 파일 업로드
      </label>
      <input
        type="file"
        accept="video/*"
        onChange={handleChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
      />
    </div>
  );
};

export default VideoUploader;
