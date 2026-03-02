"use client"
import React, { useState, useEffect } from 'react';

const GridHighlights = () => {
  const [cells, setCells] = useState([]);

  useEffect(() => {
    const totalBlocks = 2000; // Increased count slightly for better effect
    const newCells = [];
    
    // Adjust these max values to fit your visible grid area
    const maxRows = 40; // 150 might be too far down if you mask early
    const maxCols = 80; 

    const safeZone = {
      minCol: 10, // Start of text area (left)
      maxCol: 40, // End of text area (right)
      minRow: 2,  // Start of text area (top)
      maxRow: 15  // End of text area (bottom)
    };

    for (let i = 0; i < totalBlocks; i++) {
      newCells.push({
        id: i,
        left: Math.floor(Math.random() * maxCols) * 24,
        top: Math.floor(Math.random() * maxRows) * 24,
        // Lower opacity for a subtle "texture" feel like the reference
        opacity: Math.random() * 0.1 + 0.05 
      });
    }
    setCells(newCells);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {cells.map((cell) => (
        <div
          key={cell.id}
          // CHANGE: 'bg-black' to 'bg-white' to light them up
          className="absolute bg-black/40" 
          style={{
            width: '23px', // 23px creates a 1px gap so it doesn't overlap the grid lines
            height: '23px',
            left: `${cell.left + 1}px`, // +1 offset to center in the grid cell
            top: `${cell.top + 1}px`,
            opacity: cell.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default GridHighlights;