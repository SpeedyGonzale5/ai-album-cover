'use client'

import { useState } from 'react'

export default function DownloadButton({ cover, audioFile, analysis }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadUrls, setDownloadUrls] = useState({ png: null, jpg: null, svg: null })

  const generateAndDownload = async (format) => {
    setIsGenerating(true)
    
    try {
      let downloadUrl;
      
      if (cover.type === 'ai-generated' && cover.previewUrl.startsWith('data:')) {
        // For AI-generated images (base64 data URLs)
        downloadUrl = cover.previewUrl;
      } else if (cover.previewUrl && cover.previewUrl.includes('<svg')) {
        // For SVG content
        const svgBlob = new Blob([cover.previewUrl], { type: 'image/svg+xml' });
        downloadUrl = URL.createObjectURL(svgBlob);
      } else {
        // Fallback
        downloadUrl = cover.downloadUrl || cover.previewUrl;
      }

      if (cover.type === 'ai-generated' && format !== 'png') {
        // Convert base64 image to different formats using canvas
        await convertAndDownload(downloadUrl, format);
      } else {
        // Direct download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${audioFile.name.replace(/\.[^/.]+$/, "")}-${cover.style.replace(/\s+/g, '-')}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        if (downloadUrl.startsWith('blob:')) {
          URL.revokeObjectURL(downloadUrl);
        }
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  const convertAndDownload = async (dataUrl, format) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${audioFile.name.replace(/\.[^/.]+$/, "")}-${cover.style.replace(/\s+/g, '-')}.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        }, mimeType, 0.95);
      };
      
      img.src = dataUrl;
    });
  }

  return (
    <div>
      <button 
        onClick={() => generateAndDownload('png')}
        className="w-full text-center py-3 rounded-lg font-bold text-white bg-black hover:bg-gray-800 transition-colors duration-300"
      >
        {isGenerating ? 'Generating...' : 'Download PNG'}
      </button>
      <div className="flex justify-between items-center mt-2 text-sm">
        <button 
          onClick={() => generateAndDownload('jpg')}
          className="text-gray-600 hover:text-black font-medium transition-colors"
        >
          JPG
        </button>
        <button 
          onClick={() => generateAndDownload('svg')}
          className="text-gray-600 hover:text-black font-medium transition-colors"
        >
          SVG
        </button>
      </div>
    </div>
  )
}