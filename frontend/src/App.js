import React, { useState } from 'react';
import Game from './components/Game';
import GameHistory from './components/GameHistory';


function App() {
  const [view, setView] = useState('game');
  
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-8">Stone Paper Scissors</h1>
      <div className="flex justify-center space-x-4 mb-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded" 
          onClick={() => setView('game')}>Play Game</button>
        <button 
          className="bg-gray-500 text-white px-4 py-2 rounded" 
          onClick={() => setView('history')}>Game History</button>
      </div>

      {view === 'game' ? <Game /> : <GameHistory />}
    </div>
  );
}

export default App;
