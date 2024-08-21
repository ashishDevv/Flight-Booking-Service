const { StatusCodes } = require('http-status-codes');

const { ErrorResponse, SuccessResponse } = require('../utils/common')

const { PaymentService } = require('../services');

/**
 * POST: /payment
 * req-body: {userId, bookingId}
 */
async function createPayment(req, res) {
    try {
        const payment =  await PaymentService.createPayment({
            userId: req.userData.id,
            bookingId: req.body.bookingId
        })
        SuccessResponse.data = payment
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse); 
    } catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
    }
}

/**
 * GET: /user/payments/:id  && /admin/payments/:id
 * req-body: {}
 */
async function getPayment(req, res) {             //user && Admin
    try {
        const payment = await PaymentService.getPayment(req.params.id);
        SuccessResponse.data = payment;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } 
    catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
    }
}

/**
 * GET: /user/payments
 * req-body: {userId}
 */

async function getAllPayment(req, res) {          //user
    try {
        const payments = await PaymentService.getAllPayment(req.userData.id);
        SuccessResponse.data = payments;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
    }
}

/**
 * GET: /user/bookings/:id/payments   &&  /admin/bookings/:id/payments
 * req-body: {bookingId}
 */

async function getBookingPayment(req, res) {          //user && Admin
    
    try {
        const payment = await PaymentService.getBookingPayment(req.params.id);
        SuccessResponse.data = payment;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
    }
}

module.exports = {
    createPayment,
    getPayment,
    getAllPayment,
    getBookingPayment
}