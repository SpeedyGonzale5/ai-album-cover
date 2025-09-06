export const genreColorPalettes = {
  'Electronic': [
    ['#00FFFF', '#FF00FF', '#0080FF'],
    ['#00FF80', '#8000FF', '#FF0080'],
    ['#40E0D0', '#FF1493', '#00BFFF']
  ],
  'Rock': [
    ['#FF4500', '#8B0000', '#000000'],
    ['#DC143C', '#2F4F4F', '#696969'],
    ['#B22222', '#000000', '#FF6347']
  ],
  'Pop': [
    ['#FF69B4', '#FFB6C1', '#FF1493'],
    ['#FF6347', '#FFD700', '#FF69B4'],
    ['#DA70D6', '#FF20B2', '#FFA07A']
  ],
  'Hip-Hop': [
    ['#4B0082', '#000000', '#FFD700'],
    ['#8A2BE2', '#000000', '#FF4500'],
    ['#9932CC', '#1C1C1C', '#DAA520']
  ],
  'Jazz': [
    ['#B8860B', '#2F4F4F', '#8B4513'],
    ['#CD853F', '#556B2F', '#8B4513'],
    ['#DAA520', '#2F4F4F', '#A0522D']
  ],
  'Classical': [
    ['#000080', '#4169E1', '#F5F5DC'],
    ['#483D8B', '#6495ED', '#E6E6FA'],
    ['#191970', '#4682B4', '#F0F8FF']
  ],
  'R&B': [
    ['#9932CC', '#FF1493', '#4B0082'],
    ['#8B008B', '#FF69B4', '#6A0DAD'],
    ['#9400D3', '#FF00FF', '#8A2BE2']
  ],
  'Dance': [
    ['#00FF00', '#FF00FF', '#00FFFF'],
    ['#ADFF2F', '#FF1493', '#00CED1'],
    ['#32CD32', '#FF69B4', '#1E90FF']
  ],
  'Ambient': [
    ['#87CEEB', '#B0E0E6', '#ADD8E6'],
    ['#B0C4DE', '#E0F6FF', '#F0F8FF'],
    ['#AFEEEE', '#E6F3FF', '#F5FFFA']
  ],
  'Folk': [
    ['#8FBC8F', '#DEB887', '#D2691E'],
    ['#9ACD32', '#F4A460', '#CD853F'],
    ['#228B22', '#DAA520', '#A0522D']
  ]
}

export function getGenreColors(genres) {
  const primaryGenre = Array.isArray(genres) ? genres[0] : genres
  const palettes = genreColorPalettes[primaryGenre] || genreColorPalettes['Electronic']
  return palettes[Math.floor(Math.random() * palettes.length)]
}