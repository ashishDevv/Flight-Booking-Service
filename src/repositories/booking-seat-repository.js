const CrudRepository = require('./crud-repository');

const BookingSeat = require('../models/booking-seat');

class BookingSeatRepository extends CrudRepository {  
    constructor () {
        super(BookingSeat)
    }

    async createBookingSeat(data, transaction) {
        const bookingSeat = await BookingSeat.create(data, { transaction: transaction });
        return bookingSeat;
    }
    
    async bulkCreateBookingSeat(data, transaction) {
        const bookingSeat = await BookingSeat.bulkCreate(data, { transaction: transaction });
        return bookingSeat;
    }
    
    async getAllBookingSeat(bookingId, transaction) {
        const bookingSeat = await BookingSeat.findAll({
            where: { bookingId: bookingId },
            transaction: transaction
        })
        if(bookingSeat.length === 0) {
            throw new AppError('Not able to find the resources', StatusCodes.NOT_FOUND);
        }
        return bookingSeat;
    }
    
    async deleteBookingSeat(data, transaction) {
        const bookingSeat = await BookingSeat.destroy({
            where: { seatId: data },
            transaction: transaction
        })
        if(bookingSeat === 0) {
            throw new AppError('Not able to find the resource to delete', StatusCodes.NOT_FOUND);
        }
        return bookingSeat;
    }

    async getUserBookedSeats(bookingId) {
        const bookedSeats = await BookingSeat.findAll({
            where: { bookingId: bookingId }
        })
        if(bookedSeats.length === 0) {                        
            throw new AppError('Not able to find the resources', StatusCodes.NOT_FOUND);
        }
        return bookedSeats;
    }

    async destroyBookingAllSeats(bookingId, transaction) {
        const response = await BookingSeat.destroy({
            where: { bookingId: bookingId },
            transaction: transaction
        })
        if(response === 0) {
            throw new AppError('Not able to find the resource to delete', StatusCodes.NOT_FOUND);
        }
        return response;
    }
    
};

module.exports = BookingSeatRepository;