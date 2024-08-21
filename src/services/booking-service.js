const { StatusCodes } = require('http-status-codes');
const { BookingRepository, BookingSeatRepository, SeatRepository } = require('../repositories')
const AppError = require('../utils/errors/app-error'); 
const axios = require('axios');
const sequelize = require('../models/index')
const { updateFlightSeats } = require('./seat-service')

const bookingRepository = new BookingRepository();
const bookingSeatRepository = new BookingSeatRepository();
const seatRepo = new SeatRepository();

async function createBooking(data) {                            //user 

    console.log("data in service -> ", data );
    

    //create new transaction
    const transaction = await sequelize.transaction();

    try {
        
        //verify seats in that flight exists
        const avaliableSeats = await seatRepo.getAllSeats({
            flightId: data.flightId,
            numberOfSeats: data.numberOfSeats,
            class: data.class,
        }, transaction)

        console.log("Available seats -> ", avaliableSeats);
        
        //check available seats == to No. of seats to be booked or not
        if(avaliableSeats.length < data.numberOfSeats) {
            await transaction.rollback();
            throw new AppError('Seats are not available in this flight', StatusCodes.INTERNAL_SERVER_ERROR)
        }

        const seatIds = avaliableSeats.map((seat) => {   // store seat ids in a array
            return seat.id
        })

        console.log("seatIds: ", seatIds);
        
        const seatPrice = avaliableSeats[0].price;    // store seat price
        console.log("seat price ", seatPrice);
        

        //create new booking in database
        const booking = await bookingRepository.createBook({
            flightId: data.flightId,
            userId: data.userId,
            noOfSeats: data.numberOfSeats,
            totalPrice: seatPrice*data.numberOfSeats,
            
        }, transaction )

        //bulk store seatIds with bookingId in BookingSeat model
        const bookingSeats = seatIds.map((seatId) => {
            return {
                bookingId: booking.id,
                seatId: seatId
            }
        })

        const bookedSeats = await bookingSeatRepository.bulkCreateBookingSeat(bookingSeats, transaction)  // this call bulk create function in BookingSeatRepository
        
        //change status of seats to LOCKED
        const updateSeatStatus = await seatRepo.updateSeatStatus({
            status: 'LOCKED',
            seatIds: seatIds,
        }, transaction)

        const updateFlightSeat = await updateFlightSeats({
            flightId: data.flightId,
            class: data.class,
            noOfSeats: data.numberOfSeats,
            increment: false
        })
        
        
        // also send flight details by calling flights service by API and add flight details to this returning booking object
                 
        const fd = await getFlightDetails(booking.flightId);
        booking.dataValues.flightDetails = fd.data.data

        await transaction.commit();

        console.log("All booking: ", booking);
        
        return booking;  
    } catch (error) {
        
        await transaction.rollback();

        if(error.message == 'Cannot fetch Flight details'){
            const updateFlightSeat = await updateFlightSeats({
                flightId: data.flightId,
                class: data.class,
                noOfSeats: data.numberOfSeats,
                increment: true
            })
            throw error;
        }
        if(error instanceof AppError) {
            throw error;
        }
        throw new AppError("Can not book seats in this flight", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function destroyBooking(bookingId) {         //Automatically called at some intervals   

    const transaction = await sequelize.transaction();

    try {
        //verify bookingId exists
        const booking = await bookingRepository.getBooking(bookingId, transaction);

        if(!booking) {
            await transaction.rollback();
        }
        if(booking.status === 'COMPLETED') {
            await transaction.rollback();
        }

        //get all the seatIds from BookingSeat table for this bookingId in a Array
        const bookingSeats = await bookingSeatRepository.getAllBookingSeat(bookingId, transaction);
        const seatIds = bookingSeats.map((seat) => {
            return seat.seatId;
        })

        //destroy this booking
        const desBooking = bookingRepository.deleteBooking(bookingId, transaction);   // it will also destroy the seats and booking combination in BookingSeat table as onDelete: 'CASCADE'

        //update seat status of these seatIds to 'AVAILABLE'
        const updateSeatStatus = await seatRepo.updateSeatStatus({
            status: 'AVALIABLE',
            seatIds: seatIds,
        }, transaction)

        const seatDetail = await seatRepo.get(seatIds[0]);
        const seatsClass = seatDetail.class;

        const updateFlightSeat = await updateFlightSeats({
            flightId: booking.flightId,
            class: seatsClass,
            noOfSeats: booking.noOfSeats,
            increment: true
        })
        
        await transaction.commit();
        console.log(desBooking);
        
        return true;
    } catch (error) {
        await transaction.rollback();
        console.log("Error while destroying booking: ", error);
    }

}

async function cancelBooking(data) {          //User                // canceling booking , those status is 'COMPLETED' means Payment is succcessfull
    
    const transaction = await sequelize.transaction();
    
    try {
        //verify bookingId exist 
        const booking = await bookingRepository.getBookingByUser(data, transaction);
        
        if(!booking) {
            throw new AppError("This booking does not Exist", StatusCodes.NOT_FOUND)
        }

        //verify booking status , it should be as 'COMPLETE' , if anything else , then throw error
        if(booking.status !== 'COMPLETED') {
            throw new AppError('This Booking can not be Cancelled', StatusCodes.BAD_REQUEST);
        }

        //ids of seats want to cancel
        const bookingSeats = await bookingSeatRepository.getAllBookingSeat(data.bookingId, transaction);
        const seatIds = bookingSeats.map((seat) => {
            return seat.seatId;
        })

        //destroy these seats from BookingSeat table
        await bookingSeatRepository.destroyBookingAllSeats(data.bookingId, transaction)

        const bookingStatus = await bookingRepository.updateBookingStatus(data.bookingId, { status: 'CANCELLED'}, transaction);


        //update seat status of these seatIds to 'AVAILABLE' in Seat table
        const updateSeatStatus = await seatRepo.updateSeatStatus({
            status: 'AVALIABLE',
            seatIds: seatIds,
        }, transaction)

        const seatDetail = await seatRepo.get(seatIds[0]);
        const seatsClass = seatDetail.class;

        const updateFlightSeat = await updateFlightSeats({
            flightId: booking.flightId,
            class: seatsClass,
            noOfSeats: booking.noOfSeats,
            increment: true
        })

        /**
         * Raise a refund ticket for admin as well as user  , How?  -> make a refund table { id, userId, bookingId, amount, paymentId, approveStatus} 
         * and add new entry to refund table, CREATE a new Refund service which handle all the refund logic
         *  Admin will approve the refunds through refund service 
         */
 
        await transaction.commit();

        return bookingStatus;
    } 
    catch (error) {
        await transaction.rollback();
        if(error instanceof AppError) {
            throw error;
        }
        throw new AppError("Can not Cancel the Booking at the moment", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getBooking(bookingId) {       //user && Admin
    try {
        const booking = await bookingRepository.get(bookingId);
        return booking;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError('Cannot fetch required Booking', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getUsersAllBooking(userId) {         //user
    try {
        const booking = await bookingRepository.getUsersAllBooking(userId);
        return booking;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError('Cannot fetch required Bookings', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getUserBookedSeats(bookingId) {         //User && Admin
    
    //get all data from booking-seat table having that bookingId
    //apply Array.map on that data to get seperate seatIds array
    //now get out seatNumber and seatClass of those seat having seat ids = seatIds array
    try {
        const bookedSeats = await bookingSeatRepository.getUserBookedSeats(bookingId);
        return bookedSeats;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError("Cannot fetch required Seats", StatusCodes.INTERNAL_SERVER_ERROR)
    }
        
}

async function getAllBooking(flightId) {         //Admin         // Get all bookings by flightId
    try {
        const booking = await bookingRepository.getAllBooking(flightId);
        return booking;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError('Cannot fetch required Bookings', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getFlightDetails(flightId) {
    try {
        const flightDetails = await axios.get(`http://localhost:3000/api/v1/admin/flights/${flightId}`);
        return flightDetails;
    } catch (error) {
        throw new AppError('Cannot fetch Flight details', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



/**
 * for Admin -> get all bookings, 
 *   filters by flightNumber, Date of Flight, 
 */


module.exports = {
    createBooking,
    destroyBooking,
    cancelBooking,
    getBooking,
    getUsersAllBooking,
    getUserBookedSeats,
    getAllBooking
}