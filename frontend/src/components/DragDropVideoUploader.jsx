import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const DragDropVideoUploader = ({ 
  onUploadSuccess, 
  currentVideo, 
  multiple = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    uploadFiles(acceptedFiles);
  }, [multiple]);

  const uploadFiles = async (files) => {
    setIsUploading(true);
    setError(null);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file); // keeping field name 'image' as per multer config

        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`, formData);
        uploadedUrls.push(res.data.url);
      }
      
      if (multiple) {
        onUploadSuccess(uploadedUrls);
      } else {
        onUploadSuccess(uploadedUrls[0]);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload video. Ensure it is under the size limit.');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.webm']
    },
    multiple: multiple
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors w-full ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-white/50 bg-[#1a1a1a]'
      }`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center justify-center space-y-2 py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-primary uppercase tracking-widest">Uploading Video...</p>
        </div>
      ) : currentVideo ? (
        <div className="relative group overflow-hidden rounded mx-auto w-full bg-black flex justify-center" style={{ maxHeight: '350px' }}>
        <video src={currentVideo} controls className="w-full h-full object-contain opacity-70 group-hover:opacity-30 transition-opacity" />
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3 pointer-events-none">
          <div className="text-center">
            <p className="text-sm text-white font-bold uppercase tracking-widest">Drag new video</p>
            <p className="text-xs text-gray-300 mt-1">or click to replace</p>
          </div>
        </div>
      </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <p className="text-sm text-white uppercase tracking-widest">Drag & Drop Video Here</p>
          <p className="text-xs text-gray-500">or click to browse files (MP4, MOV, WEBM)</p>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default DragDropVideoUploader;
