'use client'

import { useState, useRef, useEffect } from 'react'
import { analyzeAudio } from '../lib/audioAnalyzer'
import { generateCovers } from '../lib/coverGenerator'
import dynamic from 'next/dynamic'
import SpinningDisc from './SpinningDisc'
import { RainbowButton } from './magicui/rainbow-button'

export default function AudioUpload({ 
  onFileUpload, 
  audioFile, 
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
  onCoversGenerated,
  setIsGenerating,
  onOrchestralGenerate
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [waveform, setWaveform] = useState([])
  const [volume, setVolume] = useState(0.3)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
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
    const bars = Array.from({ length: 48 }, () => 
      Math.floor(Math.random() * 60) + 15
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
        audioRef.current.volume = volume
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
          className={`glass-card-inner w-full max-w-sm mx-auto p-6 flex flex-col items-center justify-start rounded-2xl transition-all duration-300 ${ 
            isDragOver ? 'drag-over scale-105' : 'hover:scale-105'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* CD Slit Container */}
          <div className="cd-slit-container">
            {/* CD positioned in half-slit */}
            <div className="cd-positioning">
              <SpinningDisc />
            </div>
          </div>

          {/* Text Content - Below the CD area */}
          <div className="text-center w-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Drop your music here
            </h3>
            <p className="text-gray-500 text-sm px-6 leading-relaxed">
              Drag & drop an audio file or click to browse
            </p>
            <p className="text-gray-400 text-xs mt-4">
              Supports MP3, WAV, M4A, AAC
            </p>
            
             {/* Orchestral Generation Button */}
             <div className="mt-6 pt-4 border-t border-gray-200">
               <RainbowButton
                 onClick={(e) => {
                   e.stopPropagation()
                   onOrchestralGenerate && onOrchestralGenerate()
                 }}
                 className="w-full font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                 variant="default"
                 size="lg"
               >
                 Generate Song
               </RainbowButton>
               <p className="text-gray-400 text-xs mt-2">
                 Create AI orchestral music + matching album cover
               </p>
             </div>
          </div>
        </div>
      ) : (
        <div className="white-audio-player rounded-3xl p-8 max-w-lg mx-auto bg-white shadow-2xl border border-gray-200">
          <div className="flex items-center space-x-6">
            <button
              onClick={togglePlayback}
              className="w-20 h-20 flex items-center justify-center flex-shrink-0 text-black text-4xl font-black hover:opacity-70 transition-opacity"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-black text-xl truncate mb-1">
                {audioFile.name.replace(/\.[^/.]+$/, "")}
              </h4>
              <p className="text-sm text-gray-600 font-semibold">
                {(audioFile.size / 1024 / 1024).toFixed(1)} MB
              </p>
              
              {isAnalyzing && (
                <div className="mt-4">
                  <div className="progress-track h-2 rounded-full bg-gray-200">
                    <div 
                      className="progress-fill rounded-full transition-all duration-300 bg-gradient-to-r from-blue-400 to-blue-600"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-semibold">
                    Analyzing... {Math.round(progress)}%
                  </p>
                </div>
              )}
            </div>
            
            {/* Volume Control Button */}
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
              title="Volume Control"
            >
              🔊
            </button>
          </div>
          
          {/* Blue Gradient Waveform Visualization */}
          <div className="mt-6 flex items-end justify-center space-x-1 h-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4">
            {waveform.map((height, index) => (
              <div
                key={index}
                className="waveform-bar-blue w-1 rounded-full"
                style={{ 
                  height: `${height}%`,
                  animationDelay: `${index * 30}ms`,
                  background: `linear-gradient(to top, 
                    hsl(${200 + (index * 1)}, 80%, 40%), 
                    hsl(${220 + (index * 0.5)}, 90%, 60%))`
                }}
              ></div>
            ))}
          </div>
          
          {/* Volume Slider */}
          {showVolumeSlider && (
            <div className="mt-4 flex items-center justify-center space-x-3 bg-gray-50 rounded-xl p-3">
              <span className="text-gray-600 text-sm font-medium">Volume:</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={volume * 100}
                onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
                className="volume-slider-white flex-1 max-w-32"
              />
              <span className="text-gray-600 text-sm font-medium min-w-8">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 text-sm text-gray-600 hover:text-black transition-colors font-semibold"
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