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

    const { imageBase64, editInstruction, analysis } = await request.json()

    if (!imageBase64 || !editInstruction || !analysis) {
      return NextResponse.json(
        { error: 'Image data, edit instruction, and analysis are required' },
        { status: 400 }
      )
    }

    // Extract base64 data from data URL if present
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64
    
    const prompt = [
      {
        text: `${editInstruction}. Keep the album cover aesthetic and maintain high quality. The music is ${analysis.genre?.join(', ')} with ${analysis.mood} mood and ${analysis.vibe} vibe.`
      },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Data,
        },
      },
    ]

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompt,
    })

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data
        const dataUrl = `data:${part.inlineData.mimeType};base64,${imageData}`
        
        return NextResponse.json({ 
          editedImage: dataUrl 
        })
      }
    }
    
    throw new Error('No image data received from Gemini API')
  } catch (error) {
    console.error('Error in edit-cover API:', error)
    return NextResponse.json(
      { error: `Failed to edit cover: ${error.message}` },
      { status: 500 }
    )
  }
}