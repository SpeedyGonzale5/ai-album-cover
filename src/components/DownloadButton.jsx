'use client'

import { useState } from 'react'

export default function DownloadButton({ cover, audioFile, analysis }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const generateHighResVersion = (svgString) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const size = 1400

      canvas.width = size
      canvas.height = size

      const img = new Image()
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)

      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size)
        URL.revokeObjectURL(url)
        
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/png', 1.0)
      }

      img.src = url
    })
  }

  const downloadCover = async (format = 'png') => {
    setIsDownloading(true)

    try {
      let blob
      let filename
      let mimeType

      if (format === 'svg') {
        blob = new Blob([cover.downloadUrl], { type: 'image/svg+xml' })
        mimeType = 'image/svg+xml'
        filename = `${getFilename()}.svg`
      } else {
        blob = await generateHighResVersion(cover.downloadUrl)
        mimeType = `image/${format}`
        filename = `${getFilename()}.${format}`
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const getFilename = () => {
    const baseName = audioFile ? 
      audioFile.name.replace(/\.[^/.]+$/, '') : 
      'album-cover'
    const style = cover.style.replace(/\s+/g, '-').toLowerCase()
    return `${baseName}-${style}`
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => downloadCover('png')}
        disabled={isDownloading}
        className="download-btn w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isDownloading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <span>⬇️</span>
            <span>Download PNG</span>
          </>
        )}
      </button>

      <div className="flex space-x-2">
        <button
          onClick={() => downloadCover('jpg')}
          disabled={isDownloading}
          className="flex-1 text-xs text-gray-600 hover:text-gray-800 py-1 px-2 rounded border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50"
        >
          JPG
        </button>
        <button
          onClick={() => downloadCover('svg')}
          disabled={isDownloading}
          className="flex-1 text-xs text-gray-600 hover:text-gray-800 py-1 px-2 rounded border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50"
        >
          SVG
        </button>
      </div>
    </div>
  )
}