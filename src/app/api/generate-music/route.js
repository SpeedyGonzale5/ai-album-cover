import { NextResponse } from 'next/server'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
})

export async function POST(request) {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    const { analysis, musicLength = 30000 } = await request.json()

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis data is required' },
        { status: 400 }
      )
    }

    // Create music prompt based on audio analysis
    const musicPrompt = createMusicPrompt(analysis, musicLength)

    try {
      // Generate music using ElevenLabs
      const trackDetails = await elevenlabs.music.composeDetailed({
        prompt: musicPrompt,
        musicLengthMs: musicLength,
      })

      // Convert audio to base64 for client consumption
      const audioBuffer = Buffer.from(trackDetails.audio)
      const audioBase64 = audioBuffer.toString('base64')
      const audioUrl = `data:audio/mpeg;base64,${audioBase64}`

      return NextResponse.json({
        success: true,
        track: {
          audioUrl: audioUrl,
          filename: trackDetails.filename,
          metadata: trackDetails.json,
          prompt: musicPrompt,
          duration: musicLength
        }
      })
    } catch (apiError) {
      console.error('ElevenLabs API error:', apiError)
      return NextResponse.json(
        { 
          error: `Music generation failed: ${apiError.message}`,
          details: apiError.body || apiError.response?.data
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in generate-music API:', error)
    return NextResponse.json(
      { error: 'Failed to generate music' },
      { status: 500 }
    )
  }
}

function createMusicPrompt(analysis, duration) {
  const genre = analysis.genre?.join(', ') || 'Electronic'
  const mood = analysis.mood || 'neutral'
  const vibe = analysis.vibe || 'modern'
  const energy = analysis.energy || 0.5
  const tempo = analysis.tempo || 120
  
  const durationSeconds = Math.round(duration / 1000)
  const energyLevel = Math.round(energy * 100)
  
  // Base prompt structure
  let prompt = `Create a ${durationSeconds}-second ${genre.toLowerCase()} track with ${mood.toLowerCase()} mood and ${vibe.toLowerCase()} vibe. `
  
  // Add tempo information
  prompt += `The tempo should be around ${tempo} BPM with ${energyLevel}% energy level. `
  
  // Genre-specific styling
  const genrePrompts = {
    electronic: `Use driving synth arpeggios, punchy drums, electronic textures, and digital effects. Focus on crisp, modern production with layered synthesizers.`,
    
    rock: `Feature electric guitars, driving drums, bass guitar, and rock instrumentation. Use power chords, guitar solos, and strong rhythmic elements.`,
    
    pop: `Create catchy melodies, accessible rhythms, polished production, and mainstream appeal. Use modern pop instrumentation and hooks.`,
    
    'hip-hop': `Include rhythmic beats, bass-heavy production, urban textures, and contemporary hip-hop elements. Focus on groove and rhythm.`,
    
    jazz: `Incorporate jazz harmonies, improvised elements, swing rhythms, brass instruments, and sophisticated chord progressions.`,
    
    classical: `Use orchestral instruments, complex arrangements, classical harmonies, and traditional compositional techniques.`,
    
    ambient: `Create atmospheric textures, ethereal soundscapes, gentle rhythms, and spacious production with reverb and delay effects.`,
    
    folk: `Feature acoustic instruments, natural textures, organic rhythms, and traditional folk elements with warm, intimate production.`,
    
    r_b: `Include smooth grooves, soulful melodies, R&B rhythms, and contemporary urban production with rich harmonies.`
  }
  
  // Apply genre-specific styling
  const genreKey = genre.toLowerCase().replace(/[&\s-]/g, '_').replace('hip_hop', 'hip-hop').replace('r_b', 'r_b')
  const genreStyle = genrePrompts[genreKey] || genrePrompts.electronic
  
  prompt += genreStyle
  
  // Add mood-specific elements
  const moodPrompts = {
    energetic: ` Make it uplifting, driving, and full of momentum with dynamic builds and exciting transitions.`,
    chill: ` Keep it relaxed, smooth, and laid-back with gentle rhythms and soothing textures.`,
    dark: ` Add darker tones, minor keys, mysterious elements, and brooding atmosphere.`,
    uplifting: ` Include bright melodies, major keys, positive energy, and inspiring progressions.`,
    intense: ` Build tension, use aggressive rhythms, powerful dynamics, and commanding presence.`,
    peaceful: ` Create calm, serene, gentle textures with soft dynamics and tranquil atmosphere.`,
    dreamy: ` Add ethereal elements, floating melodies, ambient textures, and dreamy soundscapes.`,
    romantic: ` Include warm tones, intimate melodies, soft rhythms, and emotional depth.`,
    melancholic: ` Use minor keys, reflective melodies, gentle sadness, and contemplative atmosphere.`
  }
  
  const moodStyle = moodPrompts[mood.toLowerCase()] || moodPrompts.energetic
  prompt += moodStyle
  
  return prompt
}