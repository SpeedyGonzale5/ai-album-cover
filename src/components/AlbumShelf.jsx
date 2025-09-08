import { useState } from 'react';
import WoodenShelf from './WoodenShelf';
import './AlbumShelf.css';

export default function AlbumShelf({ covers, onCDClick }) {
  return (
    <div className="album-shelf-container">
      {/* CD Cases on Shelf with integrated hover effects */}
      <WoodenShelf covers={covers} onCDClick={onCDClick} />
    </div>
  );
}
