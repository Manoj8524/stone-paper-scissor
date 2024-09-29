const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  player1: String,
  player2: String,
  rounds: [
    {
      player1Choice: String,
      player2Choice: String,
      result: String
    }
  ],
  winner: String,
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
