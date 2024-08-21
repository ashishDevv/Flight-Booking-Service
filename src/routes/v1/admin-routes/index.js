const express = require('express');

const adminBookingRoutes = require('./admin-booking-routes');
const adminSeatRoutes = require('./admin-seat-routes');
const adminPaymentRoutes = require('./admin-payment-routes');

const router = express.Router();

router.use('/bookings', adminBookingRoutes);
router.use('/seats', adminSeatRoutes);
router.use('/payments', adminPaymentRoutes);



// In this way we redirect to different routes from here

module.exports = router;