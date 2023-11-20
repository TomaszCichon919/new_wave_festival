const Concert = require('../models/concerts.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Concert.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {

  try {
    const concert = await Concert.findById(req.params.id);
    if(!seat) res.status(404).json({ message: 'Concert not found' });
    else res.json(concert);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

};

exports.addNew = async (req, res) => {
    
  try {
    const { performer, genre, price, day, image } = req.body;

    if (!image.match(/\.(jpg|jpeg|png)$/)) {
      return res.status(400).json({ error: 'Image format is incorrect. Only JPG, JPEG, or PNG formats are allowed.' });
    }

  const newConcert = new Concert({ performer, genre, price, day, image });
    await newConcert.save();
    res.json({ message: 'OK' });

  } catch(err) {
    res.status(500).json({ message: err });
  }
};


exports.edit = async (req, res) => {

  try {
    const { performer, genre, price, day, image } = req.body;

    if (!image.match(/\.(jpg|jpeg|png)$/)) {
      return res.status(400).json({ error: 'Image format is incorrect. Only JPG, JPEG, or PNG formats are allowed.' });
    }

    const concertToEdit = await Concert.findById(req.params.id);
    if(concertToEdit) {
      await Concert.updateOne({ _id: req.params.id }, { $set: {  performer, genre, price, day, image }});
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

};

exports.delete = async (req, res) => {

  try {
    const concertToDelete = await Concert.findById(req.params.id);
    if(concertToDelete) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }

};
  