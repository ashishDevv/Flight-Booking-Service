const { StatusCodes } = require('http-status-codes');
const { BookingSeatRepository } = require('../repositories')
const AppError = require('../utils/errors/app-error'); 

const bookingSeatRepository = new BookingSeatRepository();

async function createBookingSeat(data, transaction) {

}

async function bulkCreateBookingSeat(data, transaction) {

}

async function getAllBookingSeat(bookingId, transaction) {

}

async function deleteBookingSeat(data, transaction) {

}