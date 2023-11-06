const express = require('express');
const router = express.Router();
const db = require('../db');

    router.route('/testimonials').get((req, res) => {
    res.json(db.testimonials);
  });
  
  router.route('/testimonials/random').get((req, res) => {
    const randomIndex = Math.floor(Math.random() * db.testimonials.length);
    const randomTestimonial = db.testimonials[randomIndex];
    res.json(randomTestimonial);
  });
  
  
  router.route('/testimonials/:id').get((req, res) => {
    const testimonialId = Number(req.params.id);
    const testimonial = db.testimonials.find(item => item.id === testimonialId);
  
    if (!testimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
    } else {
      res.json(testimonial);
    }
  });
  
  router.route('/testimonials').post((req, res) => {
    const { author, text } = req.body;
    const newTestimonial = {
      id: Math.floor(Math.random() * 1000), 
      author,
      text,
    };
  
    db.testimonials.push(newTestimonial);
    res.status(201).json({ message: 'OK' });
  });

    router.route('/testimonials/:id').put((req, res) => {
    const testimonialId = Number(req.params.id);
    const { author, text } = req.body;
  
    const testimonialToUpdate = db.testimonials.find(item => item.id === testimonialId);
  
    if (!testimonialToUpdate) {
      res.status(404).json({ error: 'Testimonial not found' });
    } else {
      testimonialToUpdate.author = author || testimonialToUpdate.author;
      testimonialToUpdate.text = text || testimonialToUpdate.text;
      res.status(200).json({ message: 'OK' });
    }
  });
  
  router.route('/testimonials/:id').delete((req, res) => {
    const testimonialId = Number(req.params.id);
    
    const initialLength = db.testimonials.length;
    db.testimonials = db.testimonials.filter(item => item.id !== testimonialId);
    const finalLength = db.testimonials.length;
  
    if (initialLength === finalLength) {
      res.status(404).json({ error: 'Testimonial not found' });
    } else {
      res.status(200).json({ message: 'Testimonial deleted successfully' });
    }
  });
  
  module.exports = router;
  