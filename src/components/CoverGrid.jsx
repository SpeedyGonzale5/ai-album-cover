'use client'

import { useState } from 'react'
import DownloadButton from './DownloadButton'
import CoverEditor from './CoverEditor'

export default function CoverGrid({ covers, audioFile, analysis }) {
  const [editingCover, setEditingCover] = useState(null)
  
  if (!covers || covers.length === 0) return null

  const handleEditCover = (cover) => {
    setEditingCover(cover)
  }

  const handleEditComplete = (editedCover) => {
    // Update the cover in the covers array
    const coverIndex = covers.findIndex(c => c.id === editedCover.id)
    if (coverIndex !== -1) {
      covers[coverIndex] = editedCover
    }
    setEditingCover(null)
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black tracking-tighter mb-2">Generated Album Covers</h2>
        <p className="text-gray-600">6 unique AI-generated designs inspired by your music</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {covers.map((cover, index) => (
          <div key={cover.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-transform duration-300 hover:scale-105">
            <div className="aspect-square relative">
              {cover.type === 'ai-generated' && cover.previewUrl ? (
                <img 
                  src={cover.previewUrl}
                  alt={cover.style}
                  className="w-full h-full object-cover"
                />
              ) : cover.type === 'error' ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-gray-400 mb-2">❌</div>
                    <p className="text-sm text-gray-500">Generation Failed</p>
                    <p className="text-xs text-gray-400 mt-1">{cover.error}</p>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: cover.previewUrl }}
                />
              )}
              
              {cover.type === 'ai-generated' && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      AI Generated
                    </div>
                    {cover.canEdit && (
                      <button
                        onClick={() => handleEditCover(cover)}
                        className="text-white text-sm font-medium bg-blue-600/80 hover:bg-blue-600 px-3 py-1 rounded-full backdrop-blur-sm transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-gray-900 text-lg mb-1">{cover.style}</h3>
              <p className="text-sm text-gray-600 mb-4 h-10">
                {cover.description}
              </p>
              
              {/* Color Palette - only show for non-AI generated covers or if colors are available */}
              {cover.colors && (
                <div className="flex items-center space-x-2 mb-5">
                  <span className="text-xs text-gray-500 font-medium">Colors:</span>
                  {cover.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              )}

              {cover.type !== 'error' && (
                <DownloadButton 
                  cover={cover}
                  audioFile={audioFile}
                  analysis={analysis}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-gray-500">
          All covers are generated with AI at high resolution
        </p>
      </div>

      {editingCover && (
        <CoverEditor
          cover={editingCover}
          analysis={analysis}
          onComplete={handleEditComplete}
          onCancel={() => setEditingCover(null)}
        />
      )}
    </div>
  )
}