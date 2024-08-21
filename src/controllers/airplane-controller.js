const { StatusCodes } = require('http-status-codes');

const { ErrorResponse, SuccessResponse } = require('../utils/common')

const { AirplaneService } = require('../services');

/**
 * POST: /airplanes
 * req-body: {modelName, capicity}
 */
async function createAirplane(req, res) {
    try {
        const airplane = await AirplaneService.createAirplane({        // call to service function and data pass in form of object
            modelName: req.body.modelName,
            capicity: req.body.capicity
        })
        SuccessResponse.data = airplane;            // here we put data , jo hume service se mila hai, in SuccessResponse.data 
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);              // send SuccessResponse simply
    } catch (error) {
        ErrorResponse.error = error;               // here we put error ,which thrown by service , jo humne catch kar liya , and put in ErrorResponse.error
        return res
                .status(error.statusCode)          // statusCode from AppError's instance
                .json(ErrorResponse);             // send ErrorResponses simply
    }
}
/**
 * DELETE: /airplanes/:id
 * req-body: {}
 */

async function deleteAirplane(req, res) {
    try {
        const airplane = await AirplaneService.deleteAirplane(req.params.id);     // id comes in params
        SuccessResponse.data = airplane;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
    }
}
/**
 * GET: /airplanes
 * req-body: {}
 */

async function getAllAirplane(req, res) {    
    try {
        const airplane = await AirplaneService.getAllAirplane();          //it will return an array of all airplanes
        SuccessResponse.data = airplane;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
    }
}
/**
 * GET: /airplanes/:id
 * req-body: {}
 */

async function getAirplane(req, res) {     
    try {
        const airplane = await AirplaneService.getAirplane(req.params.id);    //get by primary key -> id
        SuccessResponse.data = airplane;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;               
        return res
                .status(error.statusCode)          
                .json(ErrorResponse);
    }
}
/**
 * UPDATE: /airplanes/:id
 * req-body: {}
 */

async function updateAirplane(req, res){
    try {
        const airplane = await AirplaneService.updateAirplane(req.params.id, {
            
        });
        return airplane;
    } catch (error) {
        
    }
}

