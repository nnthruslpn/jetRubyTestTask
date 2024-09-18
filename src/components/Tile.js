import React from 'react';

const Tile = ({ color, isFlipped, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="tile"
      style={{ backgroundColor: isFlipped ? color : 'gray' }}
    ></div>
  );
};

export default Tile;

