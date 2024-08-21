const express = require('express');

const adminRoutes = require('./admin-routes/index');
const userRoutes = require('./user-routes/index');

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);



// In this way we redirect to different routes from here

module.exports = router;
