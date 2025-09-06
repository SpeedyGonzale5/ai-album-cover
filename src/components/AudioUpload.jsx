'use client'

import { useState, useRef, useEffect } from 'react'
import { analyzeAudio } from '../lib/audioAnalyzer'
import { generateCovers } from '../lib/coverGenerator'

export default function AudioUpload({ 
  onFileUpload, 
  audioFile, 
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
  onCoversGenerated,
  setIsGenerating
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [waveform, setWaveform] = useState([])
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile)
      setAudioUrl(url)
      generateMockWaveform()
      startAnalysis()
      
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [audioFile])

  const generateMockWaveform = () => {
    const bars = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 40) + 10
    )
    setWaveform(bars)
  }

  const startAnalysis = async () => {
    if (!audioFile) return
    
    setIsAnalyzing(true)
    setProgress(0)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.random() * 15
      })
    }, 200)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const analysis = await analyzeAudio(audioFile)
      setProgress(100)
      
      setTimeout(() => {
        onAnalysisComplete(analysis)
        setIsAnalyzing(false)
        generateCoversAsync(analysis)
      }, 500)
    } catch (error) {
      console.error('Analysis failed:', error)
      setIsAnalyzing(false)
    }
  }

  const generateCoversAsync = async (analysis) => {
    setIsGenerating(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const covers = await generateCovers(analysis)
      onCoversGenerated(covers)
      setIsGenerating(false)
    } catch (error) {
      console.error('Cover generation failed:', error)
      setIsGenerating(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const audioFile = files.find(file => 
      file.type.startsWith('audio/') || 
      ['.mp3', '.wav', '.m4a', '.aac'].some(ext => 
        file.name.toLowerCase().endsWith(ext)
      )
    )
    
    if (audioFile) {
      onFileUpload(audioFile)
    } else {
      alert('Please upload a valid audio file (.mp3, .wav, .m4a, .aac)')
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {!audioFile ? (
        <div
          className={`audio-circle w-80 h-80 mx-auto rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isDragOver ? 'drag-over scale-105' : 'hover:scale-105'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="mb-6">
            <CDIcon />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Drop your music here
          </h3>
          <p className="text-gray-500 text-sm px-8 leading-relaxed">
            Drag & drop an audio file or click to browse
          </p>
          <p className="text-gray-400 text-xs mt-4">
            Supports MP3, WAV, M4A, AAC
          </p>
        </div>
      ) : (
        <div className="glass-card-inner rounded-2xl p-6 max-w-md mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 relative">
              <CDIcon small />
              <button
                onClick={togglePlayback}
                className="absolute inset-0 flex items-center justify-center text-white text-2xl"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-800 truncate">
                {audioFile.name.replace(/\.[^/.]+$/, "")}
              </h4>
              <p className="text-sm text-gray-500">
                {(audioFile.size / 1024 / 1024).toFixed(1)} MB
              </p>
              
              {isAnalyzing && (
                <div className="mt-3">
                  <div className="progress-track h-1 rounded-full">
                    <div 
                      className="progress-fill rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Analyzing... {Math.round(progress)}%
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Waveform Visualization */}
          <div className="mt-4 flex items-end justify-center space-x-1 h-12">
            {waveform.map((height, index) => (
              <div
                key={index}
                className="waveform-bar w-1"
                style={{ 
                  height: `${height}%`,
                  animationDelay: `${index * 50}ms`
                }}
              ></div>
            ))}
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Choose different file
          </button>
        </div>
      )}
      
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  )
}

const CDIcon = ({ small }) => {
  const size = small ? 'w-16 h-16' : 'w-24 h-24';
  const inset = small ? 'inset-1' : 'inset-2';
  const holeSize = small ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <div className={`relative ${size}`}>
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage: 'conic-gradient(from 180deg at 50% 50%, #ffc4d1, #a1e8ff, #d2baff, #fff9b0, #a8ffc1, #ffc4d1)',
          animation: 'spin 4s linear infinite',
        }}
      ></div>
      <div className={`absolute ${inset} bg-gray-100 rounded-full`} 
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(220,220,230,0.8) 100%)',
          boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
        }}
      ></div>
      <div 
        className={`absolute top-1/2 left-1/2 ${holeSize} -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-200`}
        style={{
          background: 'linear-gradient(135deg, #e0e0e0, #ffffff)',
        }}
      ></div>
    </div>
  );
};