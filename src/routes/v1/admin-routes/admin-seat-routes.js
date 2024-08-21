const express = require('express');

const { SeatController } = require('../../../controllers');

const router = express.Router();

router.post('/', SeatController.createSeat);

router.get('/:id', SeatController.getSeat); 

router.delete('/:id', SeatController.deleteSeat);

router.get('/', SeatController.getAllSeatsOfFlight);  // get all seats of a flight by flightId 

router.patch('/update-price', SeatController.updateSeatsPrice);  //this is internal route , only access by flight-search microservice

module.exports = router;