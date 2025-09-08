import { useEffect, useRef, useState } from 'react';

export default function PhoneVisualizer({ cover, audioFile, onClose }) {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const animationRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [backgroundVariant, setBackgroundVariant] = useState('particles'); // 'particles' or 'blue-sky'
  const [isRecording, setIsRecording] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Full-screen animated visualizer with dots and lines
    const particles = [];
    const particleCount = 80;
    const maxDistance = 120;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)],
        opacity: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    function animate() {
      if (backgroundVariant === 'blue-sky') {
        // Blue sky gradient background - dark blue at top to light blue at bottom
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1E3A8A'); // Dark blue at top
        gradient.addColorStop(0.3, '#3B82F6'); // Medium blue
        gradient.addColorStop(0.7, '#60A5FA'); // Light blue
        gradient.addColorStop(1, '#93C5FD'); // Very light blue at bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clean sky background without clouds
      } else {
        // Particle system background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        time += 0.01;

        particles.forEach((particle, index) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Bounce off edges
          if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
          if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

          // Pulse effect
          particle.pulse += 0.1;
          const pulseFactor = Math.sin(particle.pulse) * 0.5 + 1;

          // Draw particle
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(
            particle.x, 
            particle.y, 
            particle.size * pulseFactor, 
            0, 
            Math.PI * 2
          );
          ctx.fill();

          // Draw connections between nearby particles
          particles.slice(index + 1).forEach(otherParticle => {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) + 
              Math.pow(particle.y - otherParticle.y, 2)
            );
            
            if (distance < maxDistance) {
              ctx.globalAlpha = (maxDistance - distance) / maxDistance * 0.3;
              ctx.strokeStyle = particle.color;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          });
        });
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    }


    animate();

    // Handle resize
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [backgroundVariant]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      recordedChunksRef.current = [];
      
      const canvas = canvasRef.current;
      const stream = canvas.captureStream(30); // 30 FPS
      
      // Add audio to the stream if available
      if (audioRef.current && audioUrl) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioRef.current);
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);
        source.connect(audioContext.destination);
        
        // Combine video and audio streams
        const combinedStream = new MediaStream([
          ...stream.getVideoTracks(),
          ...destination.stream.getAudioTracks()
        ]);
        
        mediaRecorderRef.current = new MediaRecorder(combinedStream);
      } else {
        mediaRecorderRef.current = new MediaRecorder(stream);
      }
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visualizer-${cover?.style || 'track'}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      };
      
      mediaRecorderRef.current.start();
      
      // Auto-stop after 30 seconds or when audio ends
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 30000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = async () => {
    setIsDownloading(true);
    await startRecording();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Phone Mockup */}
      <div className="phone-mockup">
        {/* Phone Frame */}
        <div className="phone-frame">
          {/* Dynamic Island */}
          <div className="dynamic-island"></div>
          
          {/* Screen Content */}
          <div className="phone-screen">
            {/* Background Gradient */}
            <div className="phone-background"></div>
            
            {/* Top Info */}
            <div className="phone-top-info">
              <div className="time-display">1:00</div>
              <div className="battery-indicator"></div>
            </div>
            
            {/* Central CD */}
            <div className="phone-cd-container">
              <div className="phone-cd">
                {cover?.previewUrl ? (
                  <img 
                    src={cover.previewUrl} 
                    alt={cover.style}
                    className="phone-cd-image"
                  />
                ) : (
                  <div className="phone-cd-placeholder">
                    <div className="cd-hub"></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Full-screen Visualizer Canvas */}
            <canvas ref={canvasRef} className="phone-visualizer-canvas"></canvas>
            
            {/* Progress Bar */}
            <div className="phone-progress">
              <div className="progress-time">{formatTime(currentTime)}</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="progress-time">{formatTime(duration)}</div>
            </div>
            
            {/* Controls */}
            <div className="phone-controls">
              <button className="control-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 6v12l10-6z"/>
                </svg>
              </button>
              <button className="control-btn main-play" onClick={togglePlay}>
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              <button className="control-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 6v12l-10-6z"/>
                </svg>
              </button>
            </div>
            
            {/* Background and Download Controls */}
            <div className="phone-extra-controls">
              <button 
                className="extra-control-btn"
                onClick={() => setBackgroundVariant(backgroundVariant === 'particles' ? 'blue-sky' : 'particles')}
              >
                {backgroundVariant === 'particles' ? '☁️' : '✨'}
              </button>
              <button 
                className="extra-control-btn download-btn"
                onClick={downloadVideo}
                disabled={isDownloading || isRecording}
              >
                {isDownloading || isRecording ? '⏳' : '📥'}
              </button>
            </div>
            
            {/* Close Button */}
            <button className="phone-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  );
}
