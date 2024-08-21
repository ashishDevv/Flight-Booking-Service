const CrudRepository = require('./crud-repository');
const Seat = require('./../models/seat');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class SeatRepository extends CrudRepository {  
    constructor () {
        super(Seat)
    }

    async getAllSeats(data, transaction) {                        // data = { flightId, numberOfSeats, class }

        if (!transaction) {
            throw new AppError("Transaction object is required.", StatusCodes.INTERNAL_SERVER_ERROR);
        }
        try {
            const allSeats = await Seat.findAll({
                where: {
                    flightId: data.flightId,
                    class: data.class,
                    status: 'AVALIABLE',
                },
                limit: Number(data.numberOfSeats),               // it should be a number
                lock: transaction.LOCK.UPDATE,
                transaction: transaction,        
                // Use row-level locking            
            });
            
            return allSeats;
        } catch (error) {
            throw new AppError("Cannot select the seats", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * LOCK.UPDATE: Locks rows for updates. This is used to ensure that rows cannot be modified or selected by other transactions until 
     *  the current transaction is complete.
     * 
     * LOCK.SHARE: Allows other transactions to read the locked rows but prevents them from updating or deleting the rows until the 
     *  current transaction is complete.
     */

    async updateSeatStatus(data, transaction) {                 // data = { status, seatIds[] }
        const [seatUpdate] = await Seat.update(
            { status: data.status},
            { 
                where: { id: data.seatIds },
                transaction: transaction
        })
        if(seatUpdate === 0 ) {
            throw new AppError('Not able to find the resource to update', StatusCodes.NOT_FOUND);
        }
        
        return seatUpdate;
    }

    async getAllSeatsOfFlight (flightId) {
        const seats =  await Seat.findAll({
            where: {
                flightId: flightId
            }
        })
        if(seats.length === 0) {                   
            throw new AppError('No seat in this flight', StatusCodes.NOT_FOUND);
        }
        return seats;
    }

    async updateSeatsPrice(data) {  //data = { flightId, class, price }
        
        const [response] = await Seat.update({price: data.price}, {
            where: {
                    flightId: data.flightId,
                    class: data.class
            }
        });
        if(response === 0) {
            throw new AppError('Not able to find the resource to update', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async createSeat(data, transaction) {
                                                                      
        const seat = await Seat.create(data, {transaction: transaction}); 
        return seat;                               
    }

    async destroySeat(seatId, transaction) {

        const response = await Seat.destroy({
            where: { id: seatId},
            transaction: transaction
        })
        if(response === 0) {
            throw new AppError("Not able to find the resource to destroy", StatusCodes.NOT_FOUND);
        } 
        
        return response;
    }
   
};

module.exports = SeatRepository;




