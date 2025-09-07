import { useEffect, useRef, useState } from 'react';

export default function MusicVisualizer({ cover, onClose }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Extract colors from cover or use defaults
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    
    // Particle system
    const particles = [];
    const particleCount = 150;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    function animate() {
      if (!isPlaying) return;
      
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
          
          if (distance < 100) {
            ctx.globalAlpha = (100 - distance) / 100 * 0.3;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      // Audio visualization bars (simulated)
      const barCount = 64;
      const barWidth = canvas.width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const height = Math.sin(time * 3 + i * 0.1) * 100 + 150;
        const colorIndex = Math.floor((i / barCount) * colors.length);
        
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="visualizer-fullscreen">
      <canvas ref={canvasRef} id="visualizer-canvas"></canvas>
      <div className="visualizer-controls">
        <div className="now-playing">
          <div className="mini-cover-container">
            {cover.previewUrl ? (
              <img src={cover.previewUrl} className="mini-cover spinning" alt={cover.style} />
            ) : (
              <div className="mini-cover bg-gray-400 flex items-center justify-center text-white text-xs">
                No Image
              </div>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>Generated Track</div>
            <div style={{ fontSize: '0.9em', opacity: 0.8 }}>{cover.style} Style</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={togglePlay}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}