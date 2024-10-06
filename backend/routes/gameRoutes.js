const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',  
  database: 'yelp', 
  password: 'password123',  
  port: 5432,
});

pool.connect()
  .then(() => console.log("connected to postgres"))
  .catch(err => console.log("Connection error:", err)); 


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

router.get('/', async (req, res) => {
  try {
    const games = await pool.query('SELECT * FROM games');
    res.json(games.rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
