# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `npm run build`
- **Start production server**: `npm start` 
- **Lint code**: `npm run lint`

## Project Architecture

This is a Next.js 14 single-page application that generates AI-powered album covers and matching music from uploaded audio files. The app integrates Google Gemini for visual generation and ElevenLabs for music creation.

### Core Application Flow

1. **Landing Page**: Users see a "Press to Generate" overlay on an animated neomorphic background
2. **File Upload**: Circular drag-and-drop zone appears after clicking to generate
   - **Alternative**: "Generate Grand Orchestral Song" button creates instant orchestral content
3. **Audio Analysis**: Mock analysis extracts genre, mood, tempo, and energy from filename patterns
4. **Cover Generation**: 3 different AI-generated album covers are created using Google Gemini API
5. **Music Generation**: Optional AI music creation using ElevenLabs Music API that matches the analysis
6. **Modal Display**: Results shown in a modal with download capabilities and editing options

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
- **MusicGenerator.jsx**: UI for generating AI music tracks
- **MusicPlayer.jsx**: Audio player with waveform visualization and controls

### Cover Generation System

The app generates 3 distinct cover styles:
- **Minimalist**: Clean geometric shapes
- **Vintage**: Retro aesthetic with text elements
- **Abstract**: Random organic shapes and patterns

**Orchestral covers include 3 specialized styles:**
- **Classical Elegance**: Sophisticated orchestral elements
- **Epic Cinematic**: Dramatic cinematic grandeur  
- **Minimalist Orchestra**: Modern take on classical design

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

- The project now uses real AI generation via Google Gemini API (visuals) and ElevenLabs API (music)
- Audio analysis is still filename-based pattern matching for demonstration  
- All AI generation happens server-side via secure API routes to protect API keys
- API routes: `/api/generate-covers`, `/api/edit-cover`, `/api/generate-music`, and `/api/generate-orchestral`
- Environment variables `GEMINI_API_KEY` and `ELEVENLABS_API_KEY` are kept server-side only
- Uses dynamic imports for performance optimization where needed

## API Integration

### Google Gemini (Image Generation)
- Generates 3 unique album cover styles based on music analysis
- Supports conversational editing of generated covers
- Handles text-to-image and image-to-image generation

### ElevenLabs Music
- Generates studio-quality music tracks (15s to 2min) 
- Creates genre-appropriate music based on analysis data
- **Orchestral Generation**: One-click creation of grand orchestral symphonies with matching album covers
- Requires paid ElevenLabs subscription for access
- Returns high-quality MP3 audio files

## Special Features

### Grand Orchestral Generation
- **One-Click Experience**: Users can generate a complete orchestral symphony + album cover instantly
- **No Upload Required**: Creates content without needing to upload audio files
- **Epic & Cinematic**: Generates majestic orchestral compositions with full orchestra arrangements
- **Matching Visuals**: Automatically creates classical, elegant album covers that match the orchestral theme
- **Professional Quality**: 10-second studio-quality symphonic pieces with dramatic builds and rich harmonies

## Security

- **API Key Protection**: All API keys are never exposed to client-side code
- **Server-side Processing**: All AI API calls happen through Next.js API routes
- **No Client-side Secrets**: No `NEXT_PUBLIC_` variables containing sensitive information
- **Secure Audio Handling**: Generated music is returned as base64 data URLs for secure delivery