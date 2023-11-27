const Seat = require('../models/seats.model');

exports.getAll = async (req, res) => {
    try {
      res.json(await Seat.find());
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };
  
  
  exports.getById = async (req, res) => {

    try {
      const seatToSelect = await Seat.findById(req.params.id);
      if(!seatToSelect) res.status(404).json({ message: 'Seat not found' });
      else res.json(seatToSelect);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  
  };
  
  exports.addNew = async (req, res) => {
 
    try {
    const { day, seat, client, email } = req.body;
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email input is incorrect' });
      };

      const isSeatTaken = await Seat.findOne({ day: day, seat: seat });

  if (isSeatTaken) {
    return res.status(409).json({ message: "The slot is already taken..." });
  }

    const newSeat = new Seat({ day, seat, client, email });
      await newSeat.save();
      res.json({ message: 'OK' });
    req.io.emit('seatsUpdated', JSON.stringify(await Seat.find()));
  
    } catch(err) {
      res.status(500).json({ message: err });
    }
  };

  exports.edit = async (req, res) => {
    try {
        const { day, seat, client, email } = req.body;

        
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email input is incorrect' });
      }
    
      const seatToUpdate = await Seat.findById(req.params.id);
      if(seatToUpdate) {
        await Seat.updateOne({ _id: req.params.id }, { $set: { day, seat, client, email }});
        res.status(200).json({ message: 'OK' });
      }
     else res.status(404).json({ error: 'Seat not found' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  
  };
  
  exports.delete = async (req, res) => {

    try {
      const seatToDelete = await Seat.findById(req.params.id);
      if(seatToDelete) {
        await Seat.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Seat deleted successfully' });
      }
      else res.status(404).json({ message: 'Not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  
  };

  exports.getSeats = async (req, res) => {
    const { day } = req.params;
  
    try {
      const seatsForDay = await Seat.find({ day: day });
      const totalSeats = 50; 
      const freeSeats = totalSeats -  seatsForDay.length;
      res.json({ freeSeats: freeSeats });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
  
  
  
  