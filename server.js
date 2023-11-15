const express = require('express');
const path = require('path');
const cors = require('cors');
const socket = require('socket.io');
const db = require('./db');



const app = express();
app.use(cors());
app.use(express.json());

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
    res.status(404).send('404 not found...');
  });
  

  io.on('connection', (socket) => {
    console.log('New socket');
    socket.emit('seatsUpdated', JSON.stringify(db.seats));

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  });