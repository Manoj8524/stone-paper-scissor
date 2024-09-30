import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import { Table, Typography } from 'antd';

const { Title } = Typography;

const initialState = {
  games: [],
  loading: true,
  error: null,
};

const gamesReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return { ...state, games: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

function GameHistory() {
  const [state, dispatch] = useReducer(gamesReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      }
    };

    fetchData();
  }, []);

  const columns = [
    { title: 'Player 1', dataIndex: 'player1', key: 'player1' },
    { title: 'Player 2', dataIndex: 'player2', key: 'player2' },
    { title: 'Winner', dataIndex: 'winner', key: 'winner' },
    { title: 'Rounds', dataIndex: 'rounds', key: 'rounds', render: (rounds) => rounds.map(round => `${round.result}`).join(', ') },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="text-center">Game History</Title>

      {state.loading ? (
        <p className="text-center">Loading game history...</p>
      ) : state.error ? (
        <p className="text-center text-red-600">Error: {state.error}</p>
      ) : (
        <Table columns={columns} dataSource={state.games} rowKey="_id" pagination={{ pageSize: 5 }} />
      )}
    </div>
  );
}

export default GameHistory;
