const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

// Postgres pool setup


// PostgreSQL pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Secure connection-kku ithu venum
  },
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.log("Connection error:", err));

// Create a new game
router.post('/', async (req, res) => {
  const { player1, player2, rounds, winner } = req.body;

  try {
    const newGame = await pool.query(
      'INSERT INTO games (player1, player2, rounds, winner) VALUES ($1, $2, $3, $4) RETURNING *',
      [player1, player2, JSON.stringify(rounds), winner]
    );
    res.json(newGame.rows[0]);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await pool.query('SELECT * FROM games');
    res.json(games.rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
