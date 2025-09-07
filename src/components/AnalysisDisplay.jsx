'use client'

export default function AnalysisDisplay({ analysis }) {
  if (!analysis) return null

  const getGenreColor = (genre) => {
    const colors = {
      'Electronic': 'from-cyan-500 to-blue-600',
      'Rock': 'from-red-500 to-orange-600',
      'Pop': 'from-pink-500 to-purple-600',
      'Hip-Hop': 'from-purple-500 to-indigo-600',
      'Jazz': 'from-yellow-500 to-orange-600',
      'Classical': 'from-blue-500 to-indigo-600',
      'R&B': 'from-purple-500 to-pink-600',
      'Dance': 'from-green-500 to-teal-600',
      'Ambient': 'from-blue-400 to-cyan-500',
      'Folk': 'from-green-600 to-yellow-600'
    }
    return colors[genre] || 'from-gray-500 to-gray-600'
  }

  const getMoodEmoji = (mood) => {
    const emojis = {
      'Energetic': '⚡',
      'Chill': '😌',
      'Melancholic': '🌧️',
      'Uplifting': '☀️',
      'Dark': '🌑',
      'Peaceful': '🕊️',
      'Intense': '🔥',
      'Dreamy': '✨',
      'Aggressive': '💥',
      'Romantic': '💕'
    }
    return emojis[mood] || '🎵'
  }

  const getEnergyColor = (energy) => {
    if (energy < 0.3) return 'from-green-400 to-green-600'
    if (energy < 0.7) return 'from-yellow-400 to-orange-500'
    return 'from-orange-500 to-red-600'
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black tracking-tighter mb-2">Music Analysis</h2>
        <p className="text-gray-600">AI-powered insights into your track</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Genre Tags */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-sm">
            <span className="mr-2 text-lg">🎯</span>
            Detected Genres
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.genre.map((genre, index) => (
              <span
                key={index}
                className={`text-sm font-medium bg-gradient-to-r ${getGenreColor(genre)} text-white px-3 py-1 rounded-full`}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Mood & Vibe */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-sm">
            <span className="mr-2 text-lg">🎭</span>
            Mood & Vibe
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Mood:</span>
              <span className="font-medium flex items-center">
                <span className="mr-2">{getMoodEmoji(analysis.mood)}</span>
                {analysis.mood}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overall Vibe:</span>
              <span className="font-medium">{analysis.vibe}</span>
            </div>
            {analysis.key && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Key:</span>
                <span className="font-medium">{analysis.key}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tempo */}
        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center text-sm">
            <span className="mr-2 text-lg">⏱️</span>
            Tempo Analysis
          </h3>
          <div>
            <span className="text-5xl font-bold text-black tracking-tighter">{analysis.tempo}</span>
            <span className="text-gray-500 ml-1">BPM</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {analysis.tempo < 70 ? 'Very Slow' :
             analysis.tempo < 100 ? 'Slow' :
             analysis.tempo < 120 ? 'Moderate' :
             analysis.tempo < 140 ? 'Fast' : 'Very Fast'}
          </div>
        </div>

        {/* Energy Level */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-sm">
            <span className="mr-2 text-lg">⚡</span>
            Energy Level
          </h3>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`bg-blue-600 h-2.5 rounded-full`}
                style={{ width: `${analysis.energy * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Low</span>
              <span className="font-medium">
                {Math.round(analysis.energy * 100)}%
              </span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Duration */}
      {analysis.duration && (
        <div className="glass-card-inner rounded-xl p-4 text-center">
          <span className="text-gray-600">Track Duration: </span>
          <span className="font-semibold text-gray-800">{analysis.duration}</span>
        </div>
      )}
    </div>
  )
}