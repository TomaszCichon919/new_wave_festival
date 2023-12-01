const Testimonial = require('../models/testimonials.model');
const sanitize = require('mongo-sanitize');



exports.getAll = async (req, res) => {

  try {
    const sanitizedData = sanitize(req.query);
    res.json(await Testimonial.find(sanitizedData));
  } catch (err) {
    res.status(500).json({ message: err });
  }
   
  };
  

  exports.getRandom = async (req, res) => {

    try {
      const count = await Testimonial.countDocuments();
      const rand = Math.floor(Math.random() * count);
      const test = await Testimonial.findOne().skip(rand);
      if(!test) res.status(404).json({ message: 'Not found' });
      else res.json(test);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  
  };
  
  
  exports.getById = async (req, res) => {

    try {
      const testimonialToUpdate = await Testimonial.findById(req.params.id);
      if(!testimonialToUpdate) res.status(404).json({ error: 'Testimonial not found' });
      else res.json(testimonialToUpdate);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  
  };

  exports.addNew = async (req, res) => {
 
    try {
    const { author, text } = req.body;
    const newTestimonial = new Testimonial({ author, text });
      await newTestimonial.save();
      res.status(201).json({ message: 'OK' });
  
    } catch(err) {
      res.status(500).json({ message: err });
    }
  };
  
  exports.edit = async (req, res) => {
    const { author, text } = req.body;
    try {
      const testimonialToUpdate = await Product.findById(req.params.id);
      if(testimonialToUpdate) {
        await Testimonial.updateOne({ _id: req.params.id }, { $set: { author, text  }});
        res.json({ message: 'OK' });
      }
      else res.status(404).json({ error: 'Testimonial not found' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  
  };
  

  exports.delete = async (req, res) => {

    try {
      const testimonialToDelete = await Product.findById(req.params.id);
      if(testimonialToDelete) {
        await Testimonial.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Testimonial deleted successfully' });
      }
      else  res.status(404).json({ error: 'Testimonial not found' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  
  };

  