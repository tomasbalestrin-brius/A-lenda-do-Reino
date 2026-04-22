import React from 'react';

export const GridCell = React.memo(({ 
  index, cx, cy, cellSize, 
  rulerMode, isRulerStart, isRulerEndCell, isRulerCell,
  fogEnabled, isRevealed, isGM,
  onMouseEnter, onMouseLeave, onClick 
}) => {
  return (
    <div
      className={`absolute transition-colors ${
        rulerMode
          ? isRulerStart
            ? 'bg-cyan-400/30 cursor-crosshair'
            : isRulerEndCell && rulerStart
              ? 'bg-cyan-400/20 cursor-crosshair'
              : isRulerCell
                ? 'bg-cyan-400/10 cursor-crosshair'
                : 'hover:bg-cyan-400/10 cursor-crosshair'
          : 'hover:bg-amber-400/5 cursor-crosshair'
      }`}
      style={{
        width: cellSize,
        height: cellSize,
        left: `${cx * (100 / 15)}%`, // Note: GRID_SIZE is hardcoded as 15 for now
        top: `${cy * (100 / 15)}%`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Fog Layer */}
      {fogEnabled && !isRevealed && (
        <div className={`absolute inset-0 transition-opacity ${isGM ? 'bg-black/80' : 'bg-black/95'}`} />
      )}
    </div>
  );
});
