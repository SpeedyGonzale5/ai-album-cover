import { getGenreColors } from '../utils/genreColors'
import { 
  generateMinimalistCover,
  generateVintageCover,
  generateAbstractCover,
  generateGeometricCover,
  generatePhotoCover,
  generateTypographyCover
} from '../utils/svgGenerator'

export function generateCovers(analysis) {
  return new Promise((resolve) => {
    const covers = []
    const generators = [
      {
        name: 'Minimalist',
        generator: generateMinimalistCover,
        description: 'Clean geometric design with modern simplicity'
      },
      {
        name: 'Vintage',
        generator: generateVintageCover,
        description: 'Retro aesthetic with classic album vibes'
      },
      {
        name: 'Abstract',
        generator: generateAbstractCover,
        description: 'Flowing organic shapes and dynamic composition'
      },
      {
        name: 'Geometric',
        generator: generateGeometricCover,
        description: 'Sharp angles and structured patterns'
      },
      {
        name: 'Atmospheric',
        generator: generatePhotoCover,
        description: 'Dreamy blurred elements with depth'
      },
      {
        name: 'Typography',
        generator: generateTypographyCover,
        description: 'Bold text-focused design with striking fonts'
      }
    ]

    generators.forEach((gen, index) => {
      const colors = getGenreColors(analysis.genre)
      const svgContent = gen.generator(colors, analysis)
      const styleLabel = `${gen.name} ${analysis.genre ? analysis.genre[0] : 'Style'}`
      
      covers.push({
        id: `cover-${index + 1}`,
        style: styleLabel,
        description: gen.description,
        previewUrl: svgContent,
        downloadUrl: svgContent,
        colors: colors
      })
    })

    setTimeout(() => resolve(covers), 100)
  })
}