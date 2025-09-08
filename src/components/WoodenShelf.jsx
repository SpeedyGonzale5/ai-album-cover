import { useState } from 'react';
import './WoodenShelf.css';

export default function WoodenShelf({ covers, onCDClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleEditImage = (cover, e) => {
    e.stopPropagation();
    // Handle edit image functionality
    console.log('Edit image for:', cover);
  };

  const handleCreateVisualizer = (cover, e) => {
    e.stopPropagation();
    // Handle create visualizer functionality
    console.log('Create visualizer for:', cover);
  };

  return (
    <div className="wooden-shelf-container">
      <div className="shelf-container">
        <div className="shelf">
          <div>
          {covers.map((cover, index) => (
            <div
              key={cover.id || index}
              className={`case cd ${hoveredIndex === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onCDClick(cover)}
              style={{
                animationDelay: `${index * 0.5}s` // Stagger the floating animation
              }}
            >
              {/* CD Case */}
              <div>
                <div className="img">
                  <span>
                    <img 
                      src={cover.previewUrl || '/api/placeholder/140/140'} 
                      alt={cover.style || 'Album Cover'}
                    />
                  </span>
                </div>
              </div>
              
              {/* Hover Effects */}
              {hoveredIndex === index && (
                <div className="hover-subtitle">
                  Click to Edit
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
