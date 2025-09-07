import { NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const { analysis } = await request.json()

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis data is required' },
        { status: 400 }
      )
    }

    const coverStyles = [
      {
        name: 'Minimalist',
        description: 'Clean geometric design with modern simplicity'
      },
      {
        name: 'Vintage',
        description: 'Retro aesthetic with classic album vibes'
      },
      {
        name: 'Abstract',
        description: 'Flowing organic shapes and dynamic composition'
      }
    ]

    // Generate covers in parallel
    const coverPromises = coverStyles.map(async (style, index) => {
      try {
        const prompt = createAlbumCoverPrompt(style.name, analysis)
        
        const response = await genAI.models.generateContent({
          model: "gemini-2.5-flash-image-preview",
          contents: prompt,
        })

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const imageData = part.inlineData.data
            const dataUrl = `data:${part.inlineData.mimeType};base64,${imageData}`
            
            return {
              id: `cover-${index + 1}`,
              style: `${style.name} ${analysis.genre ? analysis.genre[0] : 'Style'}`,
              description: style.description,
              previewUrl: dataUrl,
              downloadUrl: dataUrl,
              type: 'ai-generated',
              canEdit: true
            }
          }
        }
        
        throw new Error('No image data received from Gemini API')
      } catch (error) {
        console.error(`Error generating ${style.name} cover:`, error)
        return {
          id: `cover-${index + 1}`,
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

    return NextResponse.json({ covers })
  } catch (error) {
    console.error('Error in generate-covers API:', error)
    return NextResponse.json(
      { error: 'Failed to generate album covers' },
      { status: 500 }
    )
  }
}

function createAlbumCoverPrompt(style, analysis) {
  const genre = analysis.genre?.join(', ') || 'Unknown'
  const mood = analysis.mood || 'neutral'
  const vibe = analysis.vibe || 'modern'
  const energy = analysis.energy || 0.5
  
  const basePrompt = `Create a high-quality, professional album cover in ${style.toLowerCase()} style for ${genre} music. The mood is ${mood} with a ${vibe} vibe and energy level of ${Math.round(energy * 100)}%. The cover should be square format (1:1 aspect ratio), suitable for music streaming platforms.`

  const stylePrompts = {
    minimalist: `${basePrompt} Use clean geometric shapes, minimal color palette, lots of negative space, and modern typography. Focus on simplicity and elegance with subtle gradients or solid colors.`,
    
    vintage: `${basePrompt} Create a retro aesthetic with warm, muted colors, vintage typography, textured backgrounds, and classic album design elements from the 60s-80s era. Include subtle aging effects and nostalgic elements.`,
    
    abstract: `${basePrompt} Design with flowing organic shapes, dynamic composition, artistic brush strokes, and creative color blending. Use abstract forms that evoke the music's emotional essence through non-representational art.`,
    
    geometric: `${basePrompt} Feature sharp angles, structured patterns, mathematical precision, bold geometric forms, and symmetrical designs. Use strong contrast and architectural elements with clean lines.`,
    
    atmospheric: `${basePrompt} Create dreamy, ethereal visuals with soft gradients, blurred elements, atmospheric depth, and ambient lighting. Include particle effects or cosmic elements that match the music's mood.`,
    
    typography: `${basePrompt} Focus on bold, striking typography as the main design element. Use creative text layouts, interesting fonts, and typographic hierarchy. The text should be the hero element with supporting visual elements.`
  }

  return stylePrompts[style.toLowerCase()] || basePrompt
}