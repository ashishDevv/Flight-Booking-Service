const CrudRepository = require('./crud-repository');
const Payment = require('./../models/payment');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class PaymentRepository extends CrudRepository {
    constructor() {
        super(Payment)
    }

    async createPayment(data, transaction) {
        const response = await Payment.create(data, {transaction: transaction});
        return response;
    } 

    async getAllPayment(userId) {
        const payments = await Payment.findAll({
            where: { userId: userId }
        })
        if(payments.length === 0) {                   
            throw new AppError('Not able to find the resources', StatusCodes.NOT_FOUND);
        }
        return payments;
    }

    async getBookingPayment(bookingId) {
        const payment = await Payment.findOne({
            where: {
                bookingId: bookingId
            }
        })
        if(!payment) {                   
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return payment;
    }
}

module.exports = PaymentRepository;