import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { getSeats, loadSeats } from '../../../redux/seatsRedux';
import './SeatChooser.scss';
import io from 'socket.io-client';

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const dispatch = useDispatch();
  const seats = useSelector(getSeats);
  const [socket, setSocket] = useState(); 
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  useEffect(() => {
  const socket = io('ws://localhost:8000', { transports: ['websocket'] });
  setSocket(socket);

  socket.on('seatsUpdated', (seats) => {
    setOccupiedSeats(JSON.parse(seats));
    dispatch(loadSeats(JSON.parse(seats)));
  });


  return () => {
    socket.disconnect();
  };
}, [dispatch]);

const occupiedSeatsForSelectedDay = occupiedSeats.filter(
  (seat) => seat.day === chosenDay
);



  const isTaken = (seatId) => {
    return (seats.some(item => (item.seat === seatId && item.day === chosenDay)));
  }

  const prepareSeat = (seatId) => {
    if(seatId === chosenSeat) return <Button key={seatId} className="seats__seat" color="primary">{seatId}</Button>;
    else if(isTaken(seatId)) return <Button key={seatId} className="seats__seat" disabled color="secondary">{seatId}</Button>;
    else return <Button key={seatId} color="primary" className="seats__seat" outline onClick={(e) => updateSeat(e, seatId)}>{seatId}</Button>;
  }

  return (
    <div>
      <h3>Pick a seat</h3>
      <div className="mb-4">
        <small id="pickHelp" className="form-text text-muted ms-2"><Button color="secondary" /> – seat is already taken</small>
        <small id="pickHelpTwo" className="form-text text-muted ms-2"><Button outline color="primary" /> – it's empty</small>
      </div>
      <div className="seats">{[...Array(50)].map((x, i) => prepareSeat(i+1) )}</div>
      <div><p>Free seats: {occupiedSeatsForSelectedDay.length || 0}/50</p></div>
   
    </div>
  )
}

export default SeatChooser;