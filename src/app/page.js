'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import AudioUpload from '../components/AudioUpload'
import AnalysisDisplay from '../components/AnalysisDisplay'
import CoverGrid from '../components/CoverGrid'
import CDBookshelf from '../components/CDBookshelf'
import WoodenShelf from '../components/WoodenShelf'
import AlbumShelf from '../components/AlbumShelf'
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
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState(null)

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
    setGeneratedVideo(null)
    setIsGeneratingVideo(false)
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

  const handleVideoGenerate = async (cover) => {
    // Prevent double generation with user feedback
    if (isGeneratingVideo) {
      alert('🚨 Video generation already in progress! Please wait for the current video to complete.')
      return
    }
    
    setShowOptions(false)
    setIsGeneratingVideo(true)
    setGeneratedVideo(null)
    
    // Show immediate feedback
    const loadingAlert = setTimeout(() => {
      alert('🎬 Video generation started! This will take 2-3 minutes. You will be automatically redirected when ready.')
    }, 100)
    
    try {
      const prompt = generateVideoPrompt(cover, analysis)
      
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: cover.previewUrl,
          prompt: prompt,
          duration: '8s',
          generateAudio: false, // Disable audio to avoid loud volume issues
          resolution: '720p' // Will be 9:16 aspect ratio
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate video')
      }

      setGeneratedVideo({
        url: result.videoUrl,
        cover: cover,
        prompt: prompt
      })
      
      clearTimeout(loadingAlert)
      
      // Show success notification and auto-redirect
      alert('✨ Video generated successfully! Redirecting to phone visualizer...')
      
      setTimeout(() => {
        setSelectedCover(cover)
        setShowVisualizer(true)
      }, 1000) // Small delay for better UX
      
    } catch (error) {
      clearTimeout(loadingAlert)
      console.error('Video generation failed:', error)
      
      // More specific error messages with emojis
      let errorMessage = '❌ Failed to generate video'
      if (error.message.includes('Exhausted balance')) {
        errorMessage = '💳 Video generation failed: Account balance exhausted. Please add credits to your fal.ai account at fal.ai/dashboard/billing'
      } else if (error.message.includes('Forbidden')) {
        errorMessage = '🔒 Video generation failed: Access denied. Please check your API key and account status.'
      } else {
        errorMessage = `❌ Video generation failed: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  const generateVideoPrompt = (cover, analysis) => {
    const genre = analysis?.genre || 'music'
    const mood = analysis?.mood || 'energetic'
    const style = cover.style || 'abstract'
    
    const prompts = {
      'Minimalist Hip-Hop': `Animate this minimalist hip-hop album cover with subtle geometric movements. The shapes should pulse and shift rhythmically, with smooth camera movements that zoom in and out gently. Create a ${mood} atmosphere with flowing transitions between elements.`,
      'Vintage Rock': `Bring this vintage rock album cover to life with retro-style animations. Add subtle texture movements, vintage film grain effects, and gentle swaying motions. The camera should have slight vintage-style movements with ${mood} energy.`,
      'Abstract Electronic': `Animate this abstract electronic album cover with fluid, organic movements. Create flowing particle effects, smooth morphing shapes, and dynamic color transitions. Add subtle camera rotations and ${mood} pulsing rhythms.`,
      'Classical Elegance': `Animate this classical album cover with elegant, sophisticated movements optimized for vertical 9:16 mobile viewing. Add gentle floating effects, soft light rays, and graceful camera movements. Create a refined ${mood} atmosphere with subtle orchestral-inspired motions.`,
      'Epic Cinematic': `Bring this epic cinematic album cover to life with dramatic movements optimized for vertical 9:16 mobile viewing. Add sweeping camera motions, dynamic lighting effects, and powerful atmospheric changes. Create an ${mood} cinematic experience with grand scale movements.`,
      'Minimalist Orchestra': `Animate this minimalist orchestral album cover with clean, precise movements optimized for vertical 9:16 mobile viewing. Add subtle geometric transformations, elegant transitions, and smooth camera work. Maintain a ${mood} orchestral atmosphere with refined motions.`
    }
    
    return prompts[style] || `Animate this ${genre} album cover with ${mood} movements that match the music style, optimized for vertical 9:16 mobile viewing. Add smooth camera motions, dynamic visual effects, and rhythmic animations that bring the artwork to life with perfect mobile formatting.`
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

          {isGeneratingVideo && (
            <div className="text-center py-12">
              <div className="inline-block animate-bounce rounded-full h-12 w-12 bg-gradient-to-r from-red-500 to-pink-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Generating AI video with VEO 3...</p>
              <p className="text-gray-500 text-sm mt-2">Animating your album cover</p>
              <p className="text-gray-400 text-xs mt-1">This may take 2-3 minutes</p>
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
            <h2 className="text-4xl font-extrabold text-center mb-8 text-black">Your Album Collection</h2>
            <AlbumShelf 
              covers={covers} 
              onCDClick={handleCDClick}
            />
            <p className="text-center text-gray-600 text-lg mt-6 font-medium">
              Click to edit album cover
            </p>
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
        
        {/* Show generated video if available */}
        {generatedVideo && (
          <div className="border-t border-gray-200 pt-12 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-black mb-2">Your AI Generated Video</h2>
              <p className="text-gray-600">Album cover animated with Google VEO 3</p>
            </div>
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
              <video
                ref={(el) => {
                  if (el) {
                    el.volume = 0.1; // Set volume to 10%
                  }
                }}
                controls
                autoPlay
                loop
                className="w-full h-auto"
                src={generatedVideo.url}
              >
                Your browser does not support the video tag.
              </video>
              <div className="p-4 bg-gray-900 text-white">
                <h3 className="font-bold text-lg mb-2">{generatedVideo.cover.style}</h3>
                <p className="text-gray-300 text-sm">{generatedVideo.prompt}</p>
                <div className="flex gap-3 mt-4">
                  <a 
                    href={generatedVideo.url} 
                    download={`${generatedVideo.cover.style}-video.mp4`}
                    className="flex-1 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Download Video
                  </a>
                  <button 
                    onClick={() => {
                      setSelectedCover(generatedVideo.cover)
                      setShowVisualizer(true)
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    View in Phone
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </Modal>
      
      {/* CD Options Modal */}
      {showOptions && selectedCover && (
        <CDOptionsModal 
          cover={selectedCover}
          onEdit={handleEdit}
          onVisualizer={handleVisualizer}
          onVideoGenerate={handleVideoGenerate}
          onClose={() => setShowOptions(false)}
          isGeneratingVideo={isGeneratingVideo}
        />
      )}
      
      {/* Phone Visualizer */}
      {showVisualizer && selectedCover && (
        <PhoneVisualizer 
          cover={selectedCover}
          audioFile={audioFile}
          generatedVideo={generatedVideo}
          isGeneratingVideo={isGeneratingVideo}
          onClose={() => {
            setShowVisualizer(false)
            setGeneratedVideo(null) // Clear video when closing visualizer
          }}
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