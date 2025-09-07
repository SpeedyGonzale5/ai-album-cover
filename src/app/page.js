'use client'

import { useState } from 'react'
import AudioUpload from '../components/AudioUpload'
import AnalysisDisplay from '../components/AnalysisDisplay'
import CoverGrid from '../components/CoverGrid'
import Modal from '../components/Modal'
import Threads from '../components/Threads'

export default function Home() {
  const [audioFile, setAudioFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [covers, setCovers] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFileUpload = (file) => {
    setAudioFile(file)
    setAnalysis(null)
    setCovers([])
  }

  const handleAnalysisComplete = (analysisData) => {
    setAnalysis(analysisData)
  }

  const handleCoversGenerated = (generatedCovers) => {
    setCovers(generatedCovers)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setAudioFile(null)
    setAnalysis(null)
    setCovers([])
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Prismatic Burst Background */}
      <div className="absolute inset-0 z-0">
        <Threads />
      </div>
      
      <div className="w-full max-w-4xl relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-extrabold text-black mb-4 tracking-tighter">
              AI Album Cover Generator
            </h1>
            <p className="text-gray-700 text-xl max-w-3xl mx-auto leading-relaxed">
              Transform your music into stunning visual art. Upload any audio file and watch AI create beautiful album covers tailored to your sound.
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-12">
            <AudioUpload 
              onFileUpload={handleFileUpload}
              audioFile={audioFile}
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
              onCoversGenerated={handleCoversGenerated}
              setIsGenerating={setIsGenerating}
            />
          </div>

          {/* Loading States */}
          {isAnalyzing && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 mb-4"></div>
              <p className="text-gray-600 text-lg">Analyzing your music with AI...</p>
              <p className="text-gray-500 text-sm mt-2">Detecting genre, mood, and energy</p>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-12">
              <div className="inline-block animate-pulse rounded-full h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Creating album covers...</p>
              <p className="text-gray-500 text-sm mt-2">Generating 6 unique designs</p>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {analysis && (
          <div className="mb-12">
            <AnalysisDisplay analysis={analysis} />
          </div>
        )}
        {covers.length > 0 && (
          <div>
            <CoverGrid covers={covers} audioFile={audioFile} analysis={analysis} />
          </div>
        )}
      </Modal>
    </div>
  )
}