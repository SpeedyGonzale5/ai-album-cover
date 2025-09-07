import React from 'react';
import './NeomorphicAura.css';

const NeomorphicAura = () => {
  return (
    <div className="neo">
      {/* Central 3D Element with Glassmorphism */}
      <div className="neo-center">
        <div className="neo-center-glow"></div>
        <div className="neo-center-inner">
          <div className="neo-logo">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="60" 
              height="60" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Background Waves - Behind the Card */}
      <div className="neo-wave-background neo-wave-bg-1" style={{animationDelay: '0s'}}></div>
      <div className="neo-wave-background neo-wave-bg-2" style={{animationDelay: '5s'}}></div>
      <div className="neo-wave-background neo-wave-bg-3" style={{animationDelay: '10s'}}></div>
      
      {/* Primary Ripple Waves - Starting Close to Center */}
      <div className="neo-waves neo-wave-primary-1"></div>
      <div className="neo-waves neo-wave-primary-2"></div>
      <div className="neo-waves neo-wave-primary-3"></div>
      <div className="neo-waves neo-wave-primary-4"></div>
      
      {/* Audio Visualization Circles */}
      <div className="audio-vis-circle audio-vis-1"></div>
      <div className="audio-vis-circle audio-vis-2"></div>
      <div className="audio-vis-circle audio-vis-3"></div>
      <div className="audio-vis-circle audio-vis-4"></div>
      
      {/* Gradient Glow Layers */}
      <div className="gradient-glow glow-layer-1"></div>
      <div className="gradient-glow glow-layer-2"></div>
      <div className="gradient-glow glow-layer-3"></div>
    </div>
  );
};

export default NeomorphicAura;
