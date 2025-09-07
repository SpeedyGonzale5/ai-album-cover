'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import AudioUpload from '../components/AudioUpload'
import AnalysisDisplay from '../components/AnalysisDisplay'
import CoverGrid from '../components/CoverGrid'
import Modal from '../components/Modal'
import NeomorphicAura from '../components/NeomorphicAura'

// const Threads = dynamic(() => import('../components/Threads'), {
//   ssr: false,
// })

export default function Home() {
  const [audioFile, setAudioFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [covers, setCovers] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCardVisible, setIsCardVisible] = useState(false)

  const handleFileUpload = (file) => {
    setAudioFile(file)
    setAnalysis(null)
    setCovers([])
  }

  const handleRetry = () => {
    setIsCardVisible(false)
  }

  const handleGenerate = () => {
    setIsCardVisible(true)
    setAudioFile(null)
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
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      onClick={() => !isCardVisible && handleGenerate()}
    >
      {/* Neomorphic Aura Background */}
      <div className="absolute inset-0 z-0">
        <NeomorphicAura />
      </div>
      
      {/* Threads Background - Commented out for comparison */}
      {/* <div className="absolute inset-0 z-0">
        <Threads color={[0.678, 0.847, 0.902]} />
      </div> */}
      
      <div 
        className={`w-full max-w-4xl relative z-10 transition-all duration-700 ease-in-out ${
          isCardVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="glass-card rounded-3xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-extrabold text-black mb-4 tracking-tighter">
              Album Cover Generator
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

          <div className="text-center mt-8">
            <button
              onClick={handleRetry}
              className="bg-gray-200/70 hover:bg-gray-300/70 text-gray-700 font-semibold py-2 px-6 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`absolute z-20 w-full text-center top-[25%] transition-all duration-700 ease-in-out ${
          !isCardVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
        }`}
      >
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800/80 drop-shadow-lg cursor-pointer">
          Press to Generate
        </h2>
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