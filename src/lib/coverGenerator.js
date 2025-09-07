export async function generateCovers(analysis) {
  try {
    const response = await fetch('/api/generate-covers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ analysis }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate covers')
    }

    const { covers } = await response.json()
    return covers
  } catch (error) {
    console.error('Error in generateCovers:', error)
    throw new Error(`Failed to generate album covers: ${error.message}`)
  }
}