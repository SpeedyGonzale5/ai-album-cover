'use client'

import DownloadButton from './DownloadButton'

export default function CoverGrid({ covers, audioFile, analysis }) {
  if (!covers || covers.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Generated Album Covers</h2>
        <p className="text-gray-600">6 unique designs inspired by your music</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {covers.map((cover, index) => (
          <div key={cover.id} className="cover-preview group">
            <div className="aspect-square relative overflow-hidden rounded-t-2xl">
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: cover.previewUrl }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  Preview
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{cover.style}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {cover.description}
              </p>
              
              {/* Color Palette */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs text-gray-500">Colors:</span>
                {cover.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>

              <DownloadButton 
                cover={cover}
                audioFile={audioFile}
                analysis={analysis}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-6">
        <p className="text-sm text-gray-500">
          All covers are generated at 1400x1400px resolution
        </p>
      </div>
    </div>
  )
}