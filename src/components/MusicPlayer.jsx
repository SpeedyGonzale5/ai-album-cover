'use client'

import { useState, useRef, useEffect } from 'react'
import { downloadGeneratedMusic, getDurationString } from '../lib/musicGenerator'

export default function MusicPlayer({ track, analysis, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnd = () => setIsPlaying(false)
    const handleLoad = () => {
      setIsLoading(false)
      setDuration(audio.duration || track.duration / 1000)
    }
    const handleLoadStart = () => setIsLoading(true)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('loadeddata', handleLoad)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('ended', handleEnd)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('loadeddata', handleLoad)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('ended', handleEnd)
    }
  }, [track])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audio.currentTime = percent * audio.duration
  }

  const handleDownload = () => {
    try {
      const filename = `${analysis.genre?.[0] || 'Generated'}-${analysis.mood || 'Music'}-Track.mp3`
      downloadGeneratedMusic(track, filename)
    } catch (error) {
      alert('Failed to download track. Please try again.')
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!track) return null

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
      {/* Track Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Generated Music</h3>
        <p className="text-sm text-gray-600">
          {analysis.genre?.join(', ') || 'Unknown'} • {analysis.mood || 'Unknown'} mood
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {getDurationString(track.duration)} • AI Generated
        </p>
      </div>

      {/* Waveform Visualization */}
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-1 h-16 bg-gray-50 rounded-xl p-4">
          {Array.from({ length: 32 }, (_, i) => (
            <div
              key={i}
              className={`w-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-full transition-all duration-150 ${
                isPlaying ? 'animate-pulse' : ''
              }`}
              style={{
                height: `${20 + Math.sin(i * 0.5 + currentTime) * 15}px`,
                opacity: currentTime > (i / 32) * duration ? 1 : 0.3,
                animationDelay: `${i * 50}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Play/Pause & Seek */}
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlayback}
            disabled={isLoading}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-full flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              '⏸️'
            ) : (
              '▶️'
            )}
          </button>
          
          <div className="flex-1">
            <div 
              className="h-2 bg-gray-200 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
            }}
          />
          <span className="text-xs text-gray-500 w-8">{Math.round(volume * 100)}%</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Download MP3
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="metadata"
        className="hidden"
      />
    </div>
  )
}