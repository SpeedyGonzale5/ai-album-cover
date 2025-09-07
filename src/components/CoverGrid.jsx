'use client'

import DownloadButton from './DownloadButton'

export default function CoverGrid({ covers, audioFile, analysis }) {
  if (!covers || covers.length === 0) return null

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black tracking-tighter mb-2">Generated Album Covers</h2>
        <p className="text-gray-600">6 unique designs inspired by your music</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {covers.map((cover, index) => (
          <div key={cover.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-transform duration-300 hover:scale-105">
            <div className="aspect-square relative">
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
            
            <div className="p-5">
              <h3 className="font-bold text-gray-900 text-lg mb-1">{cover.style}</h3>
              <p className="text-sm text-gray-600 mb-4 h-10">
                {cover.description}
              </p>
              
              {/* Color Palette */}
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

              <DownloadButton 
                cover={cover}
                audioFile={audioFile}
                analysis={analysis}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-gray-500">
          All covers are generated at 1400x1400px resolution
        </p>
      </div>
    </div>
  )
}