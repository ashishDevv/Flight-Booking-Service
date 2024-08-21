const express = require('express');

const { PaymentController } = require('../../../controllers');

const router = express.Router();

router.get('/:id', PaymentController.getPayment);


module.exports = router;