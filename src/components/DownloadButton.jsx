'use client'

import { useState } from 'react'

export default function DownloadButton({ cover, audioFile, analysis }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadUrls, setDownloadUrls] = useState({ png: null, jpg: null, svg: null })

  const generateAndDownload = async (format) => {
    setIsGenerating(true)
    
    // In a real app, this would be an API call to a backend service
    // For this example, we'll simulate it
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const blob = new Blob([cover.previewUrl], { type: format === 'svg' ? 'image/svg+xml' : `image/${format}` });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${audioFile.name.replace(/\.[^/.]+$/, "")}-${cover.style}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsGenerating(false)
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