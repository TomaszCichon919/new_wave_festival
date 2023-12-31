const express = require('express');
const path = require('path');
const cors = require('cors');
const socket = require('socket.io');
const mongoose = require('mongoose');
const Seat = require('./models/seats.model');
const helmet = require('helmet');


const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

app.use(express.urlencoded({ extended: false }));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// import routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if (NODE_ENV === 'production') dbUri = 'mongodb+srv://tomekcichon03005:atlas121299@cluster0.alnb1dj.mongodb.net/NewWaveDB?retryWrites=true&w=majority';
else if (NODE_ENV === 'test') dbUri = 'mongodb://0.0.0.0:27017/NewWaveDBtest';
else dbUri = 'mongodb+srv://tomekcichon03005:atlas121299@cluster0.alnb1dj.mongodb.net/NewWaveDB?retryWrites=true&w=majority';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});



io.on('connection', async (socket) => {
  console.log('New socket');
  try {
    const seatsData = await Seat.find();
    socket.emit('seatsUpdated', JSON.stringify(seatsData));
  } catch (err) {
    console.error('Error fetching seats:', err);
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

module.exports = server;