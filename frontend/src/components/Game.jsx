import { useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandRock, faHandPaper, faHandScissors } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const choices = [
  { name: 'rock', icon: faHandRock },
  { name: 'paper', icon: faHandPaper },
  { name: 'scissors', icon: faHandScissors }
];

const initialState = {
  player1: '',
  player2: '',
  p1Choice: '',
  p2Choice: '',
  message: '',
  rounds: [],
  currentRound: 1,
  p1Wins: 0,
  p2Wins: 0,
  gameOver: false,
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, [action.payload.player]: action.payload.name };
    case 'SET_CHOICE':
      return { ...state, [action.payload.playerChoice]: action.payload.choice };
    case 'ADD_ROUND':
      return {
        ...state,
        rounds: [...state.rounds, action.payload.round],
        p1Wins: action.payload.p1Wins,
        p2Wins: action.payload.p2Wins,
        currentRound: state.currentRound + 1,
        p1Choice: '',
        p2Choice: '',
      };
    case 'SET_WINNER':
      return { ...state, message: action.payload, gameOver: true };
    case 'RESET_GAME':
      return { ...initialState };
    default:
      return state;
  }
};

const RockPaperScissors = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { player1, player2, p1Choice, p2Choice, rounds, currentRound, message, gameOver, p1Wins, p2Wins } = state;

  const playGame = async () => {
    if (p1Choice && p2Choice) {
      const result = determineWinner(p1Choice, p2Choice);
      const updatedP1Wins = p1Wins + (result.includes(player1) ? 1 : 0);
      const updatedP2Wins = p2Wins + (result.includes(player2) ? 1 : 0);

      dispatch({
        type: 'ADD_ROUND',
        payload: {
          round: { p1Choice, p2Choice, result },
          p1Wins: updatedP1Wins,
          p2Wins: updatedP2Wins,
        },
      });

      if (currentRound === 6) {
        const finalWinner = determineOverallWinner(updatedP1Wins, updatedP2Wins);
        dispatch({ type: 'SET_WINNER', payload: finalWinner });

        try {
          await axios.post(
            `http://65.2.83.96:5000/api/games`,
            {
              player1,
              player2,
              rounds: [...rounds, { p1Choice, p2Choice, result }],
              winner: finalWinner,
            },
            {
              // withCredentials: true, 
            }
          );
          console.log('Game saved successfully');
        } catch (error) {
          console.error('Error saving game:', error);
        }
      }
    }
  };

  const determineWinner = (choice1, choice2) => {
    if (choice1 === choice2) return "It's a tie!";
    if (
      (choice1 === 'rock' && choice2 === 'scissors') ||
      (choice1 === 'scissors' && choice2 === 'paper') ||
      (choice1 === 'paper' && choice2 === 'rock')
    ) {
      return `${player1} Wins Round!`;
    }
    return `${player2} Wins Round!`;
  };

  const determineOverallWinner = (p1Wins, p2Wins) => {
    if (p1Wins === p2Wins) {
      return "It's a tie overall!";
    } else if (p1Wins > p2Wins) {
      return `${player1} is the Final Winner!`;
    } else {
      return `${player2} is the Final Winner!`;
    }
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black text-white p-4">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-8 animate-bounce">Rock-Paper-Scissors</h1>

      {!gameOver ? (
        <>
          <div className="flex flex-col items-center mb-8">
            <label className="mb-2 text-lg sm:text-xl">Player 1 Name:</label>
            <input
              className="p-2 mb-4 border rounded-lg text-black w-full max-w-xs"
              value={player1}
              onChange={(e) =>
                dispatch({ type: 'SET_PLAYER', payload: { player: 'player1', name: e.target.value } })
              }
              placeholder="Enter Player 1 name"
              disabled={currentRound > 1}
            />

            <label className="mb-2 text-lg sm:text-xl">Player 2 Name:</label>
            <input
              className="p-2 mb-4 border rounded-lg text-black w-full max-w-xs"
              value={player2}
              onChange={(e) =>
                dispatch({ type: 'SET_PLAYER', payload: { player: 'player2', name: e.target.value } })
              }
              placeholder="Enter Player 2 name"
              disabled={currentRound > 1}
            />
          </div>

          <div className="flex justify-around items-center w-full max-w-lg mb-8 flex-wrap">
            <div className="flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl mb-4">{player1}'s Choice</h2>
              {choices.map(choice => (
                <button
                  key={choice.name}
                  className={`p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 mb-2 transition-all transform hover:scale-125 ${p1Choice === choice.name ? 'bg-blue-700' : ''}`}
                  onClick={() => {
                    if (!p1Choice) {
                      dispatch({ type: 'SET_CHOICE', payload: { playerChoice: 'p1Choice', choice: choice.name } });
                    }
                  }}
                  disabled={!!p1Choice}
                >
                  <FontAwesomeIcon icon={choice.icon} className="text-3xl" />
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl mb-4">{player2}'s Choice</h2>
              {choices.map((choice) => (
                <button
                  key={choice.name}
                  className={`p-4 bg-red-500 text-white rounded-full hover:bg-red-600 mb-2 transition-all transform hover:scale-125 ${
                    p2Choice === choice.name ? 'bg-red-700' : ''
                  }`}
                  onClick={() =>
                    !p2Choice &&
                    dispatch({ type: 'SET_CHOICE', payload: { playerChoice: 'p2Choice', choice: choice.name } })
                  }
                  disabled={!!p2Choice}
                >
                  <FontAwesomeIcon icon={choice.icon} className="text-3xl" />
                </button>
              ))}
            </div>
          </div>

          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all transform hover:scale-110"
            onClick={playGame}
            disabled={!p1Choice || !p2Choice}
          >
            Play Round {currentRound}
          </button>

          {message && <h2 className="mt-8 text-xl sm:text-2xl font-semibold animate-pulse">{message}</h2>}

          <div className="mt-4">
            <p className="text-lg sm:text-xl">Player 1 Wins: {p1Wins}</p>
            <p className="text-lg sm:text-xl">Player 2 Wins: {p2Wins}</p>
          </div>

          <button
            className="mt-4 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all transform hover:scale-110"
            onClick={resetGame}
          >
            Reset Game
          </button>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold">{message}</h2>
          <button
            className="mt-8 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all transform hover:scale-110"
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;
