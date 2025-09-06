export function generateMinimalistCover(colors, analysis) {
  const [primary, secondary, accent] = colors
  
  return `
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad1)"/>
      <circle cx="200" cy="200" r="80" fill="${accent}" opacity="0.8"/>
      <rect x="160" y="160" width="80" height="80" fill="${primary}" opacity="0.6"/>
    </svg>
  `
}

export function generateVintageCover(colors, analysis) {
  const [primary, secondary, accent] = colors
  
  return `
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vintageGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${secondary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${primary};stop-opacity:1" />
        </radialGradient>
        <filter id="vintage">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
        </filter>
      </defs>
      <rect width="400" height="400" fill="url(#vintageGrad)"/>
      <circle cx="200" cy="150" r="60" fill="${accent}" opacity="0.7" filter="url(#vintage)"/>
      <rect x="120" y="250" width="160" height="40" fill="${primary}" opacity="0.8"/>
      <text x="200" y="280" text-anchor="middle" fill="${accent}" font-family="serif" font-size="24" font-weight="bold">ALBUM</text>
    </svg>
  `
}

export function generateAbstractCover(colors, analysis) {
  const [primary, secondary, accent] = colors
  
  const shapes = []
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * 400
    const y = Math.random() * 400
    const size = 30 + Math.random() * 50
    const rotation = Math.random() * 360
    const color = [primary, secondary, accent][Math.floor(Math.random() * 3)]
    
    shapes.push(`
      <ellipse cx="${x}" cy="${y}" rx="${size}" ry="${size * 0.7}" 
               fill="${color}" opacity="0.7" 
               transform="rotate(${rotation} ${x} ${y})"/>
    `)
  }
  
  return `
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="abstractGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primary};stop-opacity:0.8" />
          <stop offset="50%" style="stop-color:${secondary};stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:${accent};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#abstractGrad)"/>
      ${shapes.join('')}
    </svg>
  `
}

export function generateGeometricCover(colors, analysis) {
  const [primary, secondary, accent] = colors
  
  return `
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="triangles" patternUnits="userSpaceOnUse" width="60" height="60">
          <polygon points="30,5 55,50 5,50" fill="${secondary}" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="400" height="400" fill="${primary}"/>
      <rect width="400" height="400" fill="url(#triangles)"/>
      <polygon points="200,50 350,350 50,350" fill="${accent}" opacity="0.8"/>
      <circle cx="200" cy="200" r="40" fill="${secondary}"/>
    </svg>
  `
}

export function generatePhotoCover(colors, analysis) {
  const [primary, secondary, accent] = colors
  
  return `
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="photoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${secondary};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
        </filter>
      </defs>
      <rect width="400" height="400" fill="url(#photoGrad)"/>
      <circle cx="120" cy="120" r="80" fill="${accent}" opacity="0.4" filter="url(#blur)"/>
      <circle cx="280" cy="280" r="60" fill="${secondary}" opacity="0.5" filter="url(#blur)"/>
      <rect x="0" y="320" width="400" height="80" fill="${primary}" opacity="0.7"/>
    </svg>
  `
}

export function generateTypographyCover(colors, analysis) {
  const [primary, secondary, accent] = colors
  const mood = analysis.mood || 'MUSIC'
  
  return `
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="${accent}"/>
      <text x="200" y="150" text-anchor="middle" fill="url(#textGrad)" 
            font-family="Arial Black, sans-serif" font-size="48" font-weight="900">
        ${mood.toUpperCase()}
      </text>
      <text x="200" y="220" text-anchor="middle" fill="${primary}" 
            font-family="Arial, sans-serif" font-size="24" font-weight="normal">
        ${analysis.genre ? analysis.genre[0].toUpperCase() : 'ALBUM'}
      </text>
      <line x1="50" y1="250" x2="350" y2="250" stroke="${secondary}" stroke-width="4"/>
    </svg>
  `
}