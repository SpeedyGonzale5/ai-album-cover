import React from 'react';
import './NeomorphicAura.css';

const NeomorphicAura = () => {
  return (
    <div className="neo">
      <div className="neo-center">
        {/* Triangle Logo */}
        <div className="neo-triangle">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path 
              d="M20 8L32 28H8L20 8Z" 
              fill="currentColor" 
              stroke="currentColor" 
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
      <div className="neo-waves"></div>
      <div className="neo-waves neo-waves-2"></div>
      <div className="neo-waves neo-waves-3"></div>
      <div className="neo-waves neo-waves-4"></div>
      <div className="neo-waves neo-waves-5"></div>
      <div className="neo-waves neo-waves-6"></div>
      <div className="neo-waves neo-waves-7"></div>
    </div>
  );
};

export default NeomorphicAura;
