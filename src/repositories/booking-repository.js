const CrudRepository = require('./crud-repository');
const Booking = require('../models/booking');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class BookingRepository extends CrudRepository {  
    constructor () {
        super(Booking)
    }

    async createBook(data, transaction) {
        const response = await Booking.create(data, {transaction: transaction});
        return response;
    } 

    async getBooking(bookingId, transaction) {
        console.log("booking ID -> ", bookingId);
        
        const response = await Booking.findByPk(bookingId, {transaction: transaction});
        if(!response) {
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async deleteBooking(bookingId, transaction) {
       
        const response = await Booking.destroy({
            where: { id: bookingId },
            transaction: transaction
            })
            if(response === 0) {
                throw new AppError('Not able to find the resource to delete', StatusCodes.NOT_FOUND);
            }
            return response;
    }

    async getUsersAllBooking(userId) {                        // implement pagination by limit and offset
        const allBookings = await Booking.findAll({
            where: {
                userId: userId
            }
        })
        if(allBookings.length === 0) {                        
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return allBookings;
    }

    async updateBookingStatus(bookingId, data, transaction) {
        const [response] =  await Booking.update(data, {
            where: { id: bookingId },
            transaction: transaction
        })
        if (response === 0) {
            throw new AppError("No booking found to update", StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAllBooking(flightId) {                 // get all bookings by flightId      // implement pagination by limit and offset
        const allBookings = await Booking.findAll({
            where: {
                flightId: flightId
            }
        })
        if(allBookings.length === 0) {                        
            throw new AppError('Not able to find the resources', StatusCodes.NOT_FOUND);
        }
        return allBookings;
    }

    async getBookingByUser( data, transaction) {

        if (!transaction) {
            throw new AppError("Transaction object is required.", StatusCodes.INTERNAL_SERVER_ERROR);
        }
        try {
            const booking = await Booking.findOne({
                where: {
                    userId: data.userId,
                    id: data.bookingId
                },
                lock: transaction.LOCK.UPDATE,
                transaction: transaction
            });
            return booking;
        } catch (error) {
            throw new AppError("Cannot fetch required Booking", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    
};

module.exports = BookingRepository;