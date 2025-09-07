// Client-side API service for secure ElevenLabs Music API calls
export async function generateMusic(analysis, musicLength = 30000) {
  try {
    const response = await fetch('/api/generate-music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analysis,
        musicLength
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate music')
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Music generation was not successful')
    }

    return data.track
  } catch (error) {
    console.error('Error generating music:', error)
    throw error
  }
}

export function downloadGeneratedMusic(track, audioFileName) {
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
    a.download = audioFileName || track.filename || 'generated-music.mp3'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Error downloading music:', error)
    throw new Error('Failed to download music')
  }
}

export function getDurationString(durationMs) {
  const seconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}