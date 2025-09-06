export async function analyzeAudio(audioFile) {
  return new Promise((resolve) => {
    const fileName = audioFile.name.toLowerCase()
    
    let analysis = {
      genre: [],
      mood: '',
      tempo: 120,
      energy: 0.7,
      vibe: '',
      key: 'C major',
      duration: '3:42'
    }

    if (fileName.includes('electronic') || fileName.includes('edm') || fileName.includes('house')) {
      analysis.genre = ['Electronic', 'Dance']
      analysis.mood = 'Energetic'
      analysis.tempo = Math.floor(Math.random() * 20) + 120
      analysis.energy = 0.8 + Math.random() * 0.2
      analysis.vibe = 'Pulsing & Electric'
    } else if (fileName.includes('rock') || fileName.includes('metal')) {
      analysis.genre = ['Rock']
      analysis.mood = 'Intense'
      analysis.tempo = Math.floor(Math.random() * 30) + 100
      analysis.energy = 0.7 + Math.random() * 0.3
      analysis.vibe = 'Raw & Powerful'
    } else if (fileName.includes('jazz') || fileName.includes('blues')) {
      analysis.genre = ['Jazz']
      analysis.mood = 'Chill'
      analysis.tempo = Math.floor(Math.random() * 40) + 80
      analysis.energy = 0.3 + Math.random() * 0.4
      analysis.vibe = 'Smooth & Sophisticated'
    } else if (fileName.includes('classical') || fileName.includes('orchestra')) {
      analysis.genre = ['Classical']
      analysis.mood = 'Peaceful'
      analysis.tempo = Math.floor(Math.random() * 60) + 60
      analysis.energy = 0.2 + Math.random() * 0.5
      analysis.vibe = 'Timeless & Elegant'
    } else if (fileName.includes('hip') || fileName.includes('rap')) {
      analysis.genre = ['Hip-Hop']
      analysis.mood = 'Aggressive'
      analysis.tempo = Math.floor(Math.random() * 20) + 85
      analysis.energy = 0.6 + Math.random() * 0.4
      analysis.vibe = 'Bold & Rhythmic'
    } else if (fileName.includes('pop')) {
      analysis.genre = ['Pop']
      analysis.mood = 'Uplifting'
      analysis.tempo = Math.floor(Math.random() * 30) + 100
      analysis.energy = 0.5 + Math.random() * 0.4
      analysis.vibe = 'Catchy & Melodic'
    } else if (fileName.includes('ambient') || fileName.includes('chill')) {
      analysis.genre = ['Ambient']
      analysis.mood = 'Dreamy'
      analysis.tempo = Math.floor(Math.random() * 30) + 60
      analysis.energy = 0.1 + Math.random() * 0.4
      analysis.vibe = 'Ethereal & Floating'
    } else {
      const genres = [
        ['Electronic', 'Dance'],
        ['Rock'],
        ['Pop'],
        ['Hip-Hop'],
        ['Jazz'],
        ['Classical'],
        ['R&B'],
        ['Ambient'],
        ['Folk']
      ]
      
      const moods = ['Energetic', 'Chill', 'Melancholic', 'Uplifting', 'Dark', 'Peaceful', 'Intense', 'Dreamy', 'Romantic']
      const vibes = [
        'Dark & Driving',
        'Bright & Optimistic', 
        'Smooth & Sophisticated',
        'Raw & Emotional',
        'Ethereal & Floating',
        'Bold & Rhythmic',
        'Warm & Nostalgic',
        'Fresh & Modern'
      ]
      
      analysis.genre = genres[Math.floor(Math.random() * genres.length)]
      analysis.mood = moods[Math.floor(Math.random() * moods.length)]
      analysis.tempo = Math.floor(Math.random() * 80) + 70
      analysis.energy = Math.random()
      analysis.vibe = vibes[Math.floor(Math.random() * vibes.length)]
    }

    const keys = [
      'C major', 'G major', 'D major', 'A major', 'E major', 'F major',
      'A minor', 'E minor', 'B minor', 'F# minor', 'C# minor', 'D minor'
    ]
    analysis.key = keys[Math.floor(Math.random() * keys.length)]
    
    const minutes = Math.floor(Math.random() * 4) + 2
    const seconds = Math.floor(Math.random() * 60)
    analysis.duration = `${minutes}:${seconds.toString().padStart(2, '0')}`

    setTimeout(() => resolve(analysis), 100)
  })
}