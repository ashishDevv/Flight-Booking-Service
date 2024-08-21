const { StatusCodes } = require('http-status-codes');
const { PaymentRepository, BookingRepository, SeatRepository, BookingSeatRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error'); 
const sequelize = require('../models/index');

const paymentRepo = new PaymentRepository();
const bookingRepo = new BookingRepository();
const seatRepo = new SeatRepository();
const bookingSeatRepo = new BookingSeatRepository();

async function createPayment(data) {                     // data = { userId, bookingId }

    const transaction = await sequelize.transaction();

    try {
        //verify booking exists
        const booking = await bookingRepo.getBookingByUser(data, transaction);

        if(!booking) {
            throw new AppError("This booking does not Exist OR Expired", StatusCodes.NOT_FOUND)
        }

        //verify booking status
        if(booking.status == 'COMPLETED') {
            throw new AppError("Payment is already DONE", StatusCodes.BAD_REQUEST)
        }
        if(booking.status == 'CANCELLED') {
            throw new AppError("Bad Request Done by Client", StatusCodes.BAD_REQUEST)
        } 
        
        //verify totalPrice
        
        //do payment with 3rd party payment service
        const paymentClient = {                      //dumy after payment details
            paymentMedium: 'UPI',
            amount: booking.totalPrice,
            status: 'PAID'
        }

        //if payment is not successful then -> rollback
        if(paymentClient.status === 'FAILED') {
            throw new AppError("Payment Failed ", StatusCodes.INTERNAL_SERVER_ERROR)
        }

        //update booking table with status 'COMPLETED'
        await bookingRepo.updateBookingStatus(data.bookingId, { status: 'COMPLETED'}, transaction)

        //update seatStatus
        const bookingSeats = await bookingSeatRepo.getAllBookingSeat(data.bookingId, transaction);
        const seatIds = bookingSeats.map((seat) => {
            return seat.seatId;
        })

        const updateSeatStatus = await seatRepo.updateSeatStatus({
            status: 'BOOKED',
            seatIds: seatIds,
        }, transaction)

        //add payment details to payment table
        const payment = await paymentRepo.createPayment({
            userId: data.userId,
            bookingId: data.bookingId,
            paymentMedium: paymentClient.paymentMedium,
            amount: paymentClient.amount,
            status: paymentClient.status
        }, transaction)

        //commit transaction
        await transaction.commit();

        //call Notification service for Email

        return payment;

    } 
    catch (error) {
        await transaction.rollback();
        if( error instanceof AppError ){
            throw error;
        }
        throw new AppError("Cannot Process Payment at the moment", StatusCodes.INTERNAL_SERVER_ERROR)
    }

}

async function getPayment (paymentId) {                 //User and Admin     Get payment by paymentId
    try {
        const payment = await paymentRepo.get(paymentId);
        return payment;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError('Cannot fetch required Payment', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllPayment (userId) {                 //User            //get all payments of a user 
    try {
        const payment = await paymentRepo.getAllPayment(userId);
        return payment;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError('Cannot fetch Payments', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getBookingPayment (bookingId) {                 //User and Admin     Get payment by bookingId
    
    try {
        const payment = await paymentRepo.getBookingPayment(bookingId);
        return payment;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError('Cannot fetch required Payment', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createPayment,
    getPayment,
    getAllPayment,
    getBookingPayment
}