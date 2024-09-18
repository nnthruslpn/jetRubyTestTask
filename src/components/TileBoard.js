import React from 'react';
import Tile from './Tile';

const TileBoard = ({ tiles, onTileClick }) => {
  return (
    <div className="tile-board">
      {tiles.map((tile, index) => (
        <Tile
          key={index}
          color={tile.color}
          isFlipped={tile.isFlipped}
          onClick={() => onTileClick(index)}
        />
      ))}
    </div>
  );
};

export default TileBoard;
