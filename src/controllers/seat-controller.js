const { StatusCodes } = require('http-status-codes');
const { ErrorResponse, SuccessResponse } = require('../utils/common')
const { SeatService } = require('../services');

/**
 * POST: /seats
 * req-body: {}
 */
async function createSeat(req, res) {    // first create a entry in flight-seat table with prices
    try {
        const seat =  await SeatService.createSeat({
            seatNumber: req.body.seatNumber,
            class: req.body.class,
            price: req.body.price,
            flightId: req.body.flightId
        })
        SuccessResponse.data = seat
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
 * DELETE: /seats/:id
 * req-body: {}
 */
async function deleteSeat(req, res) {
    try {
        const response =  await SeatService.deleteSeat(req.params.id)
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse); 
    } catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
        
    }
}

/**
 * GET: /seats/:id
 * req-body: {}
 */
async function getSeat(req, res) {
    try {
        const seat =  await SeatService.getSeat(req.params.id)
        SuccessResponse.data = seat;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse); 
    } catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
        
    }
}

/**
 * GET: /seats
 * req-body: {flightId}
 */
async function getAllSeatsOfFlight(req, res) {
    try {
        const seats =  await SeatService.getAllSeatsOfFlight(req.body.flightId)
        SuccessResponse.data = seats;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse); 
    } catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
        
    }
}

/**
 * PATCH: /seats/update-price
 * req-body: {flightId, class, price}
 */
async function updateSeatsPrice(req, res) {
    try {
        const response =  await SeatService.updateSeatsPrice({
            flightId: req.body.flightId,
            class: req.body.class,
            price: req.body.price
        })
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse); 
    } catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
        
    }
}

module.exports = {
    createSeat,
    deleteSeat,
    getSeat,
    getAllSeatsOfFlight,
    updateSeatsPrice
}