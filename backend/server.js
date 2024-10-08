const express = require('express'); 
const cors = require('cors');
const bodyParser = require('body-parser'); 
const gameRoutes = require('./routes/gameRoutes');
const path = require('path')

require('dotenv').config();

const app = express(); 


const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); 


app.use('/api/games', gameRoutes); 


app.use(express.static(path.join(__dirname, '../react/build'))); 


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../react/build', 'index.html')); 
});


const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
