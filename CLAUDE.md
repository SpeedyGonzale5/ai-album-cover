# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `npm run build`
- **Start production server**: `npm start` 
- **Lint code**: `npm run lint`

## Project Architecture

This is a Next.js 14 single-page application that generates AI-powered album covers from uploaded audio files. The app uses a client-side only approach with mock AI analysis.

### Core Application Flow

1. **Landing Page**: Users see a "Press to Generate" overlay on an animated neomorphic background
2. **File Upload**: Circular drag-and-drop zone appears after clicking to generate
3. **Audio Analysis**: Mock analysis extracts genre, mood, tempo, and energy from filename patterns
4. **Cover Generation**: 6 different SVG-based album covers are generated using the analysis data
5. **Modal Display**: Results shown in a modal with download capabilities

### Key Architecture Components

**State Management**: Uses React useState for all application state - no external state management library

**Audio Processing**: 
- Mock analysis in `src/lib/audioAnalyzer.js` - determines music characteristics based on filename keywords
- Real audio file handling for playback preview only
- No actual audio signal processing - analysis is simulated

**Cover Generation Pipeline**:
- `src/lib/coverGenerator.js` orchestrates the generation of 6 cover styles
- `src/utils/svgGenerator.js` contains individual SVG generators for each style
- `src/utils/genreColors.js` provides color palettes mapped to music genres

**UI Architecture**:
- Single page application in `src/app/page.js`
- Modal-based workflow for displaying results
- Glassmorphism design system with custom CSS utilities
- Neomorphic animated background using CSS animations

### Component Structure

- **AudioUpload.jsx**: Handles file upload, preview, and triggers analysis
- **AnalysisDisplay.jsx**: Shows extracted music characteristics 
- **CoverGrid.jsx**: Displays generated album covers in a grid layout
- **DownloadButton.jsx**: Handles exporting covers in multiple formats (PNG/JPG/SVG)
- **Modal.jsx**: Generic modal component for results display
- **NeomorphicAura.jsx**: Animated background component

### Cover Generation System

The app generates 6 distinct cover styles:
- **Minimalist**: Clean geometric shapes
- **Vintage**: Retro aesthetic with text elements
- **Abstract**: Random organic shapes and patterns  
- **Geometric**: Structured angular patterns
- **Atmospheric**: Blurred gradient effects
- **Typography**: Text-focused designs

Each generator function takes color palettes and analysis data to create genre-appropriate designs.

### Styling Approach

- **Tailwind CSS** for utility-first styling
- **Custom glassmorphism utilities** defined in globals.css
- **Responsive design** with mobile-first approach
- **CSS animations** for background effects and transitions

### File Upload & Processing

- Accepts audio formats: mp3, wav, m4a, aac
- Creates object URLs for audio playback
- Mock waveform visualization generation
- File validation and error handling

## Development Notes

- The project now uses real AI image generation via Google Gemini API
- Audio analysis is still filename-based pattern matching for demonstration  
- Cover generation happens server-side via secure API routes to protect API keys
- API routes: `/api/generate-covers` and `/api/edit-cover` 
- Environment variable `GEMINI_API_KEY` is kept server-side only for security
- Uses dynamic imports for performance optimization where needed

## Security

- **API Key Protection**: Gemini API key is never exposed to client-side code
- **Server-side Processing**: All AI API calls happen through Next.js API routes
- **No Client-side Secrets**: No `NEXT_PUBLIC_` variables containing sensitive information