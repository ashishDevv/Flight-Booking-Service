const express = require('express');

const userBookingRoutes = require('./user-booking-routes');
const userPaymentRoutes = require('./user-payment-routes');

const router = express.Router();

router.use('/bookings', userBookingRoutes);
router.use('/payments', userPaymentRoutes);



// In this way we redirect to different routes from here

module.exports = router;