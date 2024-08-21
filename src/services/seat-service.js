const { StatusCodes } = require('http-status-codes');
const sequelize = require('../models/index')
const { SeatRepository } = require('../repositories')
const AppError = require('../utils/errors/app-error')
const axios = require('axios');    

const seatRepository = new SeatRepository();

async function createSeat(data) {

    const transaction = await sequelize.transaction();

    try {
        const seat = await seatRepository.createSeat(data, transaction);

        const updateSeat = await updateFlightSeats({
            flightId: data.flightId,
            class: data.class,
            noOfSeats: 1,
            increment: true
        })
        await transaction.commit();
        return seat;
    } catch (error) {
        await transaction.rollback();
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {  
            let explanation = [];                        
            error.errors.forEach((err) => {              
                explanation.push(err.message)            
            });
            throw new AppError( explanation , StatusCodes.BAD_REQUEST);       
        }
        if(error instanceof AppError) {
            throw error;
        }
        throw new AppError('Cannot create new Seat', StatusCodes.INTERNAL_SERVER_ERROR); 
    }
}

async function getSeat(seatId) {       //Admin
    try {
        const seat = await seatRepository.get(seatId);
        return seat;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError('Cannot fetch required Seat', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllSeatsOfFlight(flightId) {             //Admin    get all seats of a flight by flightId
    try {
        const seats = await seatRepository.getAllSeatsOfFlight(flightId)
        return seats;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError('Cannot fetch required Seats', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// async function updateSeatStatus(data) {
//     try {
//         const seat = await seatRepository.updateSeatStatus(data)
//         return seat;
//     } catch (error) {
//         throw new AppError('Cannot update the required seats', StatusCodes.INTERNAL_SERVER_ERROR);
//     }
// }

async function updateFlightSeats(data) {               //update seats quantity in FlightSeat model of Flight-search Microservice by API call
    try {
        const seats = await axios.patch('http://localhost:3000/api/v1/admin/flight-seats/', {
            flightId: data.flightId,
            class: data.class,
            noOfSeats: data.noOfSeats,
            increment: data.increment
        })
        return seats;
    } catch (error) {
        throw new AppError("Cannot able to update Seats in Flight Service", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteSeat(seatId) {                   // for Admin

    const transaction = await sequelize.transaction();

    try {
        const seatDetail = await seatRepository.get(seatId);
    
        if(seatDetail.status !== 'AVALIABLE') {
                throw new AppError("Cannot delete this seat, seat is BOOKED or LOCKED", StatusCodes.BAD_REQUEST)
        }
        const seat = await seatRepository.destroySeat(seatId, transaction);
        
        const updateSeat = await updateFlightSeats({
            flightId: seatDetail.flightId,
            class:seatDetail.class,
            noOfSeats: 1,
            increment: false
        })

        await transaction.commit();
        return seat;
    } 
    catch (error) {
        await transaction.rollback();
        if(error instanceof AppError) {
            throw error;
        }
        throw new AppError("Cannot able to Delete the required seat", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function updateSeatsPrice (data) {             // this is only call by the flight-seat service of Flight-Search microservice, to update price of all required seats
    try {
        const response = await seatRepository.updateSeatsPrice(data);
        return response;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError('Cannot able to update price of seats', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
   

module.exports = {
    createSeat,
    updateFlightSeats,
    deleteSeat,
    getSeat,
    updateSeatsPrice,
    getAllSeatsOfFlight
}