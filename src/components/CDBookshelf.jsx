export default function CDBookshelf({ covers, onCDClick }) {
  if (!covers || covers.length === 0) {
    return (
      <div className="cd-bookshelf">
        <div className="text-center text-gray-500">
          <p>No album covers generated yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cd-bookshelf">
      <div className="cd-collection">
        {covers.map((cover, index) => (
          <div 
            key={cover.id || index}
            className="artwork"
            onClick={() => onCDClick(cover)}
            style={{
              '--index': index,
              transform: `translateX(${index * 20}px) rotateY(${index * 10}deg)`,
              zIndex: covers.length - index
            }}
          >
            {cover.previewUrl ? (
              <img src={cover.previewUrl} alt={cover.style} />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                <span>No Image</span>
              </div>
            )}
            <div className="cd-label">{cover.style}</div>
          </div>
        ))}
      </div>
    </div>
  );
}