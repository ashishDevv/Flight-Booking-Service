const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse } = require('../utils/common')
const { BookingService } = require('../services');

/**
 * POST: /user/bookings
 * req-body: {flightId, userId, numberOfSeats, class}
 */
async function createBooking(req, res) {            //user
    try {
        const booking =  await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.userData.id,
            numberOfSeats: req.body.numberOfSeats,
            class: req.body.class
        })
        SuccessResponse.data = booking
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
 * DELETE: /bookings/:id
 * req-body: {seatsClass}
 */

async function destroyBooking(req, res) {           //user
    try {
        const booking = await BookingService.destroyBooking(req.params.id, req.body.seatsClass);
        SuccessResponse.data = booking;
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
 * PATCH: /bookings
 * req-body: {userId, bookingId}
 */

async function cancelBooking(req, res) {         //user                            // it is call when a user want to cancel paid booking
    try {
        const booking = await BookingService.cancelBooking({
            userId: req.userData.id,
            bookingId: req.body.bookingId
        });
        SuccessResponse.data = booking;
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
 * GET: /user/bookings/:id  && /admin/bookings/:id
 * req-body: {}
 */
async function getBooking(req, res) {             //user && Admin
    try {
        const booking = await BookingService.getBooking(req.params.id);
        SuccessResponse.data = booking;
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
 * GET: /user/bookings
 * req-body: {userId}
 */

async function getUsersAllBooking(req, res) {          //user
    console.log("User Data from Auth middleware ->", req.userData);
    
    try {
        const booking = await BookingService.getUsersAllBooking(req.body.id);
        SuccessResponse.data = booking;
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
 * GET: /user/bookings/:id/seats   && /admin/bookings/:id/seats
 * req-body: {userId, bookingId}
 */

async function getUserBookedSeats(req, res) {            //user && Admin
    try {
        const seats = await BookingService.getUserBookedSeats(req.params.id)
        SuccessResponse.data = seats;
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
 * GET: /admin/bookings
 * req-body: {flightId}
 */

async function getAllBooking(req, res) {          //Admin
    try {
        const booking = await BookingService.getAllBooking(req.body.flightId);
        SuccessResponse.data = booking;
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
    createBooking,
    getBooking,
    getUsersAllBooking,
    getUserBookedSeats,
    getAllBooking,
    cancelBooking
    // destroyBooking,
    
}