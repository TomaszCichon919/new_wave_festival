const express = require('express');
const router = express.Router();
const db = require('../db');

router.route('/concerts').get((req, res) => {
    res.json(db.concerts);
  });
  
  router.route('/concerts/:id').get((req, res) => {
    const concertId = Number(req.params.id);
    const concert = db.concerts.find(item => item.id === concertId);
  
    if (!concert) {
      res.status(404).json({ error: 'Concert not found' });
    } else {
      res.json(concert);
    }
  });

  router.route('/concerts').post((req, res) => {
    const { performer, genre, price, day, image } = req.body;

    if (!image.match(/\.(jpg|jpeg|png)$/)) {
      return res.status(400).json({ error: 'Image format is incorrect. Only JPG, JPEG, or PNG formats are allowed.' });
    }

    const newConcert = {
      id: Math.floor(Math.random() * 1000), 
      performer,
      genre,
      price,
      day,
      image,
    };
  
    db.concerts.push(newConcert);
    res.status(201).json({ message: 'OK' });
  });
  
    router.route('/concerts/:id').put((req, res) => {
    const concertId = Number(req.params.id);
    const { performer, genre, price, day, image } = req.body;

    if (!image.match(/\.(jpg|jpeg|png)$/)) {
      return res.status(400).json({ error: 'Image format is incorrect. Only JPG, JPEG, or PNG formats are allowed.' });
    }

    const concertToUpdate = db.concerts.find(item => item.id === concertId);
  
    if (!concertToUpdate) {
      res.status(404).json({ error: 'Concert not found' });
    } else {
      concertToUpdate.performer = performer || concertToUpdate.performer;
      concertToUpdate.genre = genre || concertToUpdate.text;
      concertToUpdate.price = price || concertToUpdate.price;
      concertToUpdate.day = day || concertToUpdate.day;
      concertToUpdate.image = image || concertToUpdate.iamge;
      res.status(200).json({ message: 'OK' });
    }
  });

    router.route('/concerts/:id').delete((req, res) => {
    const concertId = Number(req.params.id);
    
    const initialLength = db.concerts.length;
    db.concerts = db.concerts.filter(item => item.id !== concertId);
    const finalLength = db.concerts.length;
  
    if (initialLength === finalLength) {
      res.status(404).json({ error: 'Concert not found' });
    } else {
      res.status(200).json({ message: 'Concert deleted successfully' });
    }
  });
  
  module.exports = router;
  