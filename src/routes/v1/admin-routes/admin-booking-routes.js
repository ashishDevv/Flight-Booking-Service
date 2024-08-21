const express = require('express');

const { BookingController, PaymentController } = require('../../../controllers');

const router = express.Router();

router.get('/:id', BookingController.getBooking);

router.get('/', BookingController.getAllBooking); 

router.get('/:id/seats', BookingController.getUserBookedSeats);

router.get('/:id/payments', PaymentController.getBookingPayment);  //to get paymrnt details of a booking


module.exports = router;