import { Row, Col } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Concert.scss';

const Concert = ({ performer, price, genre, day, image }) =>
 {
  const [freeSeats, setFreeSeats] = useState(0);

  useEffect(() => {
    axios.get(`/api/seats/free/${day}`)
      .then(response => {
        setFreeSeats(response.data.freeSeats);
      })
      .catch(error => {
        console.error('Error fetching free seats:', error);
      });
  }, [day]);

  return (
  <article className="concert">
    <Row noGutters>
      <Col xs="6">
        <div className="concert__image-container">
          <img className="concert__image-container__img" src={image} alt={performer}/>
        </div>
      </Col>
      <Col xs="6">
        <div className="concert__info">
          <img className="concert__info__back" src={image} alt={performer}/>
          <h2 className="concert__info__performer">{ performer }</h2>
          <h3 className="concert__info__genre">{ genre }</h3>
          <p className="concert__info__tickets">Only {freeSeats} tickets left!</p>
          <p className="concert__info__day-n-price">Day: {day}, Price: { price }$</p>
        </div>
      </Col>
    </Row>
  </article>
);
  }
export default Concert;