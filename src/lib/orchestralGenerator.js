// Client-side API service for orchestral generation
export async function generateOrchestralContent(musicLength = 10000) {
  try {
    const response = await fetch('/api/generate-orchestral', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        musicLength
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate orchestral content')
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Orchestral generation was not successful')
    }

    return {
      music: data.music,
      covers: data.covers, 
      analysis: data.analysis
    }
  } catch (error) {
    console.error('Error generating orchestral content:', error)
    throw error
  }
}

export function downloadOrchestralMusic(track, filename = 'Grand-Orchestral-Symphony.mp3') {
  try {
    // Convert base64 to blob for download
    const audioUrl = track.audioUrl
    const base64Data = audioUrl.split(',')[1]
    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    const blob = new Blob([bytes], { type: 'audio/mpeg' })
    const downloadUrl = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Error downloading orchestral music:', error)
    throw new Error('Failed to download orchestral music')
  }
}