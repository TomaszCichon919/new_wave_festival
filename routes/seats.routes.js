const express = require('express');
const router = express.Router();
const db = require('../db');
const socket = require('socket.io');

    router.route('/seats').get((req, res) => {
    res.json(db.seats);
  });
  
  
  router.route('/seats/:id').get((req, res) => {
    const seatId = Number(req.params.id);
    const seat = db.seats.find(item => item.id === seatId);
  
    if (!seat) {
      res.status(404).json({ error: 'Seat not found' });
    } else {
      res.json(seat);
    }
  });
  
  router.route('/seats').post((req, res) => {
    const { day, seat, client, email } = req.body;

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Email input is incorrect' });
    }

    const isSeatTaken = db.seats.some(item => item.seat === seat && item.day === day);

  if (isSeatTaken) {
    return res.status(409).json({ message: "The slot is already taken..." });
  }

    const newSeat = {
      id: Math.floor(Math.random() * 1000), 
      day,
      seat,
      client,
      email,
    };
  
    db.seats.push(newSeat);
    res.status(201).json({ message: 'OK' });
   req.io.emit('seatsUpdated', JSON.stringify(db.seats));

  });
  
    router.route('/seats/:id').put((req, res) => {
    const seatId = Number(req.params.id);
    const { day, seat, client, email } = req.body;

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Email input is incorrect' });
    }
  
    const seatToUpdate = db.seats.find(item => item.id === seatId);
  
    if (!seatToUpdate) {
      res.status(404).json({ error: 'Seat not found' });
    } else {
      seatToUpdate.day = day || seatToUpdate.day;
      seatToUpdate.seat = seat || seatToUpdate.text;
      seatToUpdate.client = client || seatToUpdate.client;
      seatToUpdate.email = email || seatToUpdate.email;
      res.status(200).json({ message: 'OK' });
    }
  });
  
  router.route('/seats/:id').delete((req, res) => {
    const seatId = Number(req.params.id);
    
    const initialLength = db.seats.length;
    db.seats = db.seats.filter(item => item.id !== seatId);
    const finalLength = db.seats.length;
  
    if (initialLength === finalLength) {
      res.status(404).json({ error: 'Seat not found' });
    } else {
      res.status(200).json({ message: 'Seat deleted successfully' });
    }
  });

  module.exports = router;
  
  