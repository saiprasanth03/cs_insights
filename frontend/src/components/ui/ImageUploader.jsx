import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

export default function ImageUploader({ value, onChange, label = "Image", className = "" }) {
  const [mode, setMode] = useState('url'); // 'url' or 'upload'
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUrlChange = (e) => {
    onChange(e.target.value);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      // Assuming axios base url points to /api/v1
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        // We get a relative url back like /uploads/filename.jpg
        // We'll construct full backend URL (e.g. http://localhost:5000/uploads/...)
        const backendUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
        const finalUrl = `${backendUrl}${response.data.url}`;
        onChange(finalUrl);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-3">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'url' 
              ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <LinkIcon className="w-4 h-4" /> Online URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'upload' 
              ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Upload className="w-4 h-4" /> Offline Upload
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          {mode === 'url' ? (
            <input 
              type="url" 
              value={value || ''}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          ) : (
            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden" 
                id="file-upload"
              />
              <label 
                htmlFor="file-upload"
                className={`flex items-center justify-center w-full h-[50px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? (
                  <span className="text-sm font-medium text-brand-600">Uploading...</span>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <Upload className="w-4 h-4" /> Click to select file from your PC
                  </span>
                )}
              </label>
            </div>
          )}
        </div>

        {value && (
          <div className="relative w-12 h-12 shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
            <ImageIcon className="absolute w-5 h-5 text-gray-300 -z-10" />
            <button 
              type="button"
              onClick={handleRemove}
              className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
