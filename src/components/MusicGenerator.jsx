'use client'

import { useState } from 'react'
import { generateMusic, getDurationString } from '../lib/musicGenerator'
import MusicPlayer from './MusicPlayer'

export default function MusicGenerator({ analysis, audioFile }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTrack, setGeneratedTrack] = useState(null)
  const [error, setError] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(30000) // 30 seconds default

  const handleGenerateMusic = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const track = await generateMusic(analysis, selectedDuration)
      setGeneratedTrack(track)
    } catch (error) {
      console.error('Music generation failed:', error)
      setError(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const durationOptions = [
    { value: 15000, label: '15 seconds', description: 'Quick preview' },
    { value: 30000, label: '30 seconds', description: 'Short track' },
    { value: 60000, label: '1 minute', description: 'Standard length' },
    { value: 120000, label: '2 minutes', description: 'Extended version' }
  ]

  if (generatedTrack) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Your AI-Generated Music</h2>
          <p className="text-gray-600">Composed to match your album covers</p>
        </div>
        
        <MusicPlayer 
          track={generatedTrack}
          analysis={analysis}
          onClose={() => setGeneratedTrack(null)}
        />
        
        <div className="text-center">
          <button
            onClick={() => setGeneratedTrack(null)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Generate New Track
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Generate Matching Music</h2>
        <p className="text-gray-600">Create AI music that matches your album covers</p>
      </div>

      {/* Music Info Preview */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="font-medium text-blue-900 mb-3">Music will be generated based on:</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Genre:</strong> {analysis.genre?.join(', ') || 'Electronic'}</p>
          <p><strong>Mood:</strong> {analysis.mood || 'Energetic'}</p>
          <p><strong>Vibe:</strong> {analysis.vibe || 'Modern'}</p>
          <p><strong>Tempo:</strong> ~{analysis.tempo || 120} BPM</p>
          <p><strong>Energy:</strong> {Math.round((analysis.energy || 0.7) * 100)}%</p>
        </div>
      </div>

      {/* Duration Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select track duration:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {durationOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                selectedDuration === option.value
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                checked={selectedDuration === option.value}
                onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                className="sr-only"
              />
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col">
                  <div className={`text-sm font-medium ${
                    selectedDuration === option.value ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-xs ${
                    selectedDuration === option.value ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {option.description}
                  </div>
                </div>
                {selectedDuration === option.value && (
                  <div className="text-blue-600">✓</div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm font-medium mb-1">Generation Failed</p>
          <p className="text-red-700 text-sm">{error}</p>
          {error.includes('API key') && (
            <p className="text-red-600 text-xs mt-2">
              Make sure your ElevenLabs API key is properly configured and you have a paid plan.
            </p>
          )}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerateMusic}
        disabled={isGenerating}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 px-6 rounded-xl transition-colors"
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating music... ({getDurationString(selectedDuration)})</span>
          </div>
        ) : (
          `Generate ${getDurationString(selectedDuration)} Track`
        )}
      </button>

      {isGenerating && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Creating your AI music track...</p>
          <p className="text-xs text-gray-500">This may take 30-60 seconds</p>
        </div>
      )}

      {/* Info */}
      <div className="text-center text-xs text-gray-500">
        <p>Powered by ElevenLabs Music AI</p>
        <p className="mt-1">Music will be generated to match your album's {analysis.genre?.[0] || 'Electronic'} style</p>
      </div>
    </div>
  )
}