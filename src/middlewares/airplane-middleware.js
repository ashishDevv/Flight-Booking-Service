const { StatusCodes } = require('http-status-codes');

const { ErrorResponse, SuccessResponse } = require('../utils/common');

const AppError = require('../utils/errors/app-error');

function validateCreateRequest(req, res, next) {
    if(!req.body.modelName) {                                      // if modelName not present (column name should be same)
        ErrorResponse.message = 'Bad request done by client';            //i modified message
        ErrorResponse.error = new AppError(['Model name not specified'], StatusCodes.BAD_REQUEST);  // here we make the object of AppError class  and pass it to ErrorResponse.error for consistent response on fronten
        return res                                                                                  
                .status(StatusCodes.BAD_REQUEST)                     // res.status.json  ( always return it)
                .json(ErrorResponse);
    }
    next();                                   //to call next middleware or last controller
}

function validateUpdateRequest(req, res, next) {
    // will implement later
}

module.exports = {
    validateCreateRequest
}