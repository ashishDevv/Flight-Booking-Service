const express = require('express');

const { PaymentController } = require('../../../controllers');

const router = express.Router();

router.get('/:id', PaymentController.getPayment);

router.post('/', PaymentController.createPayment); 

router.get('/', PaymentController.getAllPayment);


module.exports = router;