'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import AudioUpload from '../components/AudioUpload'
import AnalysisDisplay from '../components/AnalysisDisplay'
import CoverGrid from '../components/CoverGrid'
import CDBookshelf from '../components/CDBookshelf'
import CDOptionsModal from '../components/CDOptionsModal'
import PhoneVisualizer from '../components/PhoneVisualizer'
import CoverEditor from '../components/CoverEditor'
import MusicGenerator from '../components/MusicGenerator'
import MusicPlayer from '../components/MusicPlayer'
import Modal from '../components/Modal'
import NeomorphicAura from '../components/NeomorphicAura'
import { generateOrchestralContent } from '../lib/orchestralGenerator'

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
  const [isGeneratingOrchestral, setIsGeneratingOrchestral] = useState(false)
  const [orchestralContent, setOrchestralContent] = useState(null)
  const [selectedCover, setSelectedCover] = useState(null)
  const [showOptions, setShowOptions] = useState(false)
  const [showVisualizer, setShowVisualizer] = useState(false)
  const [editingCover, setEditingCover] = useState(null)

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
    setOrchestralContent(null)
    setSelectedCover(null)
    setShowOptions(false)
    setShowVisualizer(false)
    setEditingCover(null)
  }

  const handleCDClick = (cover) => {
    setSelectedCover(cover)
    setShowOptions(true)
  }

  const handleEdit = (cover) => {
    setShowOptions(false)
    setEditingCover(cover)
  }

  const handleVisualizer = (cover) => {
    setShowOptions(false)
    setSelectedCover(cover)
    setShowVisualizer(true)
  }

  const handleEditComplete = (editedCover) => {
    const updatedCovers = covers.map(c => 
      c.id === editedCover.id ? editedCover : c
    )
    setCovers(updatedCovers)
    setEditingCover(null)
  }

  const handleEditCancel = () => {
    setEditingCover(null)
  }

  const handleOrchestralGenerate = async () => {
    setIsGeneratingOrchestral(true)
    
    try {
      const result = await generateOrchestralContent(10000) // 10 second orchestral piece
      setOrchestralContent(result)
      setAnalysis(result.analysis)
      // Use the covers array from the API response
      setCovers(result.covers || [])
      setIsModalOpen(true)
    } catch (error) {
      console.error('Orchestral generation failed:', error)
      alert(`Orchestral generation failed: ${error.message}`)
    } finally {
      setIsGeneratingOrchestral(false)
    }
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
              onOrchestralGenerate={handleOrchestralGenerate}
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
              <p className="text-gray-500 text-sm mt-2">Generating 3 unique designs</p>
            </div>
          )}

          {isGeneratingOrchestral && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500/20 border-t-purple-500 mb-4"></div>
              <p className="text-gray-600 text-lg">Creating grand orchestral symphony...</p>
              <p className="text-gray-500 text-sm mt-2">Generating music & matching album cover</p>
              <p className="text-gray-400 text-xs mt-1">This may take 60-90 seconds</p>
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
        {covers && covers.length > 0 && (
          <div className="bookshelf-showcase mb-16">
            <h2 className="text-2xl font-bold text-center mb-6">Your Album Cover</h2>
            <CDBookshelf 
              covers={covers} 
              onCDClick={handleCDClick}
            />
            
            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  if (covers.length > 0) {
                    handleEdit(covers[0]);
                  }
                }}
                className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Edit Image
              </button>
              <button
                onClick={() => {
                  if (covers.length > 0) {
                    handleVisualizer(covers[0]);
                  }
                }}
                className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Create Visualizer
              </button>
            </div>
          </div>
        )}
        
        {/* Show orchestral music player if available */}
        {orchestralContent && (
          <div className="border-t border-gray-200 pt-12 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-black mb-2">Your Grand Orchestral Symphony</h2>
              <p className="text-gray-600">AI-generated orchestral music with matching album cover</p>
            </div>
            <MusicPlayer 
              track={orchestralContent.music}
              analysis={orchestralContent.analysis}
              onClose={() => {}}
            />
          </div>
        )}
        
      </Modal>
      
      {/* CD Options Modal */}
      {showOptions && selectedCover && (
        <CDOptionsModal 
          cover={selectedCover}
          onEdit={handleEdit}
          onVisualizer={handleVisualizer}
          onClose={() => setShowOptions(false)}
        />
      )}
      
      {/* Phone Visualizer */}
      {showVisualizer && selectedCover && (
        <PhoneVisualizer 
          cover={selectedCover}
          audioFile={audioFile}
          onClose={() => setShowVisualizer(false)}
        />
      )}
      
      {/* Cover Editor */}
      {editingCover && (
        <CoverEditor 
          cover={editingCover}
          analysis={analysis}
          onComplete={handleEditComplete}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  )
}