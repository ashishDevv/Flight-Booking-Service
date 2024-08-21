const express = require('express');

const { BookingController, PaymentController } = require('../../../controllers');

const router = express.Router();

router.get('/:id', BookingController.getBooking);

router.post('/', BookingController.createBooking); 

router.get('/', BookingController.getUsersAllBooking);

router.get('/:id/seats', BookingController.getUserBookedSeats);

router.get('/:id/payments', PaymentController.getBookingPayment); //to get paymrnt details of a booking

// router.delete('/bookings/:id', BookingController.destroyBooking);        //To implement later

router.patch('/', BookingController.cancelBooking);          


module.exports = router;