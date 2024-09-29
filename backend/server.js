const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const gameRoutes = require('./routes/gameRoutes');
require('dotenv').config();

// Express App Setup
const app = express();

// CORS Configuration
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Use CORS with the specified options
app.use(bodyParser.json());

// Routes
app.use('/api/games', gameRoutes);

// Use PORT from environment variable
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
