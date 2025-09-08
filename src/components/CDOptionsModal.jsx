export default function CDOptionsModal({ cover, onEdit, onVisualizer, onVideoGenerate, onClose, isGeneratingVideo }) {
  if (!cover) return null;

  return (
    <div className="cd-options-modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="options-container">
        <div className="selected-cover-display">
          <div className="artwork featured">
            {cover.previewUrl ? (
              <img src={cover.previewUrl} alt={cover.style} />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                <span>No Image</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="action-btn edit-btn" onClick={() => onEdit(cover)}>
            <span>Edit Cover</span>
            <small>Customize design and colors</small>
          </button>
          
          <button className="action-btn visualizer-btn" onClick={() => onVisualizer(cover)}>
            <span>Create Visualizer</span>
            <small>Generate music-reactive experience</small>
          </button>

          <button 
            className={`action-btn video-btn ${isGeneratingVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => onVideoGenerate(cover)}
            disabled={isGeneratingVideo}
          >
            <span>{isGeneratingVideo ? 'Generating Video...' : 'Generate Video'}</span>
            <small>{isGeneratingVideo ? 'Please wait, this may take 2-3 minutes' : 'Create AI animated video with VEO 3'}</small>
          </button>
        </div>
        
        <button className="close-options" onClick={onClose}>×</button>
      </div>
    </div>
  );
}