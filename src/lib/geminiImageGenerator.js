// Client-side API service for secure Gemini API calls
export async function editAlbumCover(imageBase64, editInstruction, analysis) {
  try {
    const response = await fetch('/api/edit-cover', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        editInstruction,
        analysis
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to edit cover')
    }

    const { editedImage } = await response.json()
    return editedImage
  } catch (error) {
    console.error('Error editing album cover:', error)
    throw error
  }
}