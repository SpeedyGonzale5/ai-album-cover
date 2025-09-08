import { useState } from 'react';
import './SpinningVinyl.css';

export default function SpinningVinyl({ cover, index, onVinylClick, style }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`vinyl-container ${isHovered ? 'hovered' : ''}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onVinylClick && onVinylClick(cover)}
    >
      <div className="vinyl-disc">
        <div className="vinyl-grooves"></div>
        <div className="vinyl-label">
          <div className="vinyl-hole"></div>
        </div>
        <div className="vinyl-shine"></div>
      </div>
    </div>
  );
}
