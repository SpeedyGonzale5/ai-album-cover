import { NextResponse } from 'next/server'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { GoogleGenAI } from "@google/genai"

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
})

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

export async function POST(request) {
  try {
    if (!process.env.ELEVENLABS_API_KEY || !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API keys not configured properly' },
        { status: 500 }
      )
    }

    const { musicLength = 10000 } = await request.json()

    // Define orchestral analysis for consistent generation
    const orchestralAnalysis = {
      genre: ['Classical', 'Orchestral'],
      mood: 'Epic',
      vibe: 'Grand & Majestic',
      energy: 0.8,
      tempo: 100,
      key: 'D major',
      duration: `${Math.round(musicLength / 1000 / 60)}:${Math.round((musicLength / 1000) % 60).toString().padStart(2, '0')}`
    }

    try {
      // Generate music and covers in parallel for better performance
      const [musicResult, coversResult] = await Promise.all([
        generateOrchestralMusic(musicLength),
        generateOrchestralCovers(orchestralAnalysis)
      ])

      return NextResponse.json({
        success: true,
        music: musicResult,
        covers: coversResult,
        analysis: orchestralAnalysis
      })
    } catch (error) {
      console.error('Generation error:', error)
      return NextResponse.json(
        { 
          error: `Generation failed: ${error.message}`,
          details: error.body || error.response?.data
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in generate-orchestral API:', error)
    return NextResponse.json(
      { error: 'Failed to generate orchestral content' },
      { status: 500 }
    )
  }
}

async function generateOrchestralMusic(musicLength) {
  const orchestralPrompt = `Create a grand, epic orchestral composition lasting ${Math.round(musicLength / 1000)} seconds. 
  
  This should be a majestic symphonic piece with:
  - Full orchestra including strings, brass, woodwinds, and timpani
  - Dramatic crescendos and dynamic builds
  - Rich harmonies in D major
  - Tempo around 100 BPM with epic, cinematic feel
  - Powerful brass fanfares and soaring string melodies
  - Timpani rolls and dramatic percussion
  - Classical orchestral arrangement with modern cinematic production
  - Inspirational and uplifting themes
  - Professional symphony orchestra quality
  
  The piece should evoke feelings of triumph, grandeur, and epic adventure - perfect for a movie soundtrack or classical concert hall.`

  const trackDetails = await elevenlabs.music.composeDetailed({
    prompt: orchestralPrompt,
    musicLengthMs: musicLength,
  })

  // Convert audio to base64 for client consumption
  const audioBuffer = Buffer.from(trackDetails.audio)
  const audioBase64 = audioBuffer.toString('base64')
  const audioUrl = `data:audio/mpeg;base64,${audioBase64}`

  return {
    audioUrl: audioUrl,
    filename: trackDetails.filename,
    metadata: trackDetails.json,
    prompt: orchestralPrompt,
    duration: musicLength
  }
}

async function generateOrchestralCovers(analysis) {
  const coverStyles = [
    {
      name: 'Classical Elegance',
      description: 'Elegant classical design with sophisticated orchestral elements',
      prompt: `Create a classical, elegant album cover for orchestral music. Use sophisticated gold and deep blue tones, featuring a concert hall interior, musical instruments like violins and cellos, elegant typography space, and refined classical aesthetics. Square format, professional and timeless.`
    },
    {
      name: 'Epic Cinematic',
      description: 'Dramatic cinematic design with epic orchestral grandeur',
      prompt: `Create an epic, cinematic album cover for orchestral music. Use dramatic lighting, conductor silhouette, grand symphony hall, powerful brass instruments, dynamic composition with rich burgundy and gold colors. Epic and grandiose feel, movie soundtrack aesthetic.`
    },
    {
      name: 'Minimalist Orchestra',
      description: 'Modern minimalist take on classical orchestral design',
      prompt: `Create a minimalist, modern album cover for orchestral music. Use clean lines, elegant typography, subtle musical note elements, refined color palette of cream, gold, and navy. Simple but sophisticated, contemporary classical aesthetic.`
    }
  ]

  // Generate all 3 covers in parallel
  const coverPromises = coverStyles.map(async (style, index) => {
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: style.prompt,
      })

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data
          const dataUrl = `data:${part.inlineData.mimeType};base64,${imageData}`
          
          return {
            id: `orchestral-cover-${index + 1}`,
            style: style.name,
            description: style.description,
            previewUrl: dataUrl,
            downloadUrl: dataUrl,
            type: 'ai-generated',
            canEdit: true
          }
        }
      }
      
      throw new Error(`No image generated for ${style.name}`)
    } catch (error) {
      console.error(`Error generating ${style.name} cover:`, error)
      return {
        id: `orchestral-cover-${index + 1}`,
        style: `${style.name} (Failed)`,
        description: `${style.description} - Generation failed`,
        previewUrl: null,
        downloadUrl: null,
        error: error.message,
        type: 'error',
        canEdit: false
      }
    }
  })

  const covers = await Promise.all(coverPromises)
  return covers
}