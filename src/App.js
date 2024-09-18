import React from 'react';
import TileBoard from './components/TileBoard';
import { useGameLogic } from './store/gameReducer';

const App = () => {
  const { tiles, flipTile } = useGameLogic();

  return (
    <div className="App">
      <h1 className="title">JetRuby Test Task</h1>
      <TileBoard tiles={tiles} onTileClick={flipTile} />
      
      <footer className="footer">
        <p>Морозов Вадим Сергеевич</p>
        <p>+7(918)338-75-90</p>
        <p>nnthruslpn@gmail.com</p>

      </footer>
    </div>
  );
};

export default App;
