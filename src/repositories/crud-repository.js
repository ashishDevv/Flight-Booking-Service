const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");

class CrudRepository {

    constructor(model) {
        this.model = model;
    }

    async create(data) {
                                                                      
        const response = await this.model.create(data); //No need to use try and catch as error get stored in 'response' which returns to service 
        return response;                                //and then handled there
    }



    async destroy(data) {
       
        const response = await this.model.destroy({
            where: {
                id: data
                }
            });

            /**
             * It returns a number in `response` , if it didn't found any records of that condition , means it didn't deleted anything then
             * it returns zero ( 0 ), or if it find record/s , then it returns the count of number of records it deleted , it can be 1,2,10
             **/

            if(response === 0) {                   
                throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
            }
            return response;
    }



    async get(data) {
        const response = await this.model.findByPk(data);
        if(!response) {                        // means if response is empty (data not present for that id), then it throws this error
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }



    async getAll() {
        const response = await this.model.findAll();

        if(response === 0) {                         // it returns an array , if it is empty , means no records found 
            throw new AppError('Not able to find the resources', StatusCodes.NOT_FOUND);
        }
        return response;
    }



    async update(id, data) {  // data is object - { col: value..}
        
        const [response] = await this.model.update(data, {   
            where: {
                    id: id
            }
        });
        /**
         *  it returns an array with only element, this element is a number of how many rows updated by the query. 
         *  If no rows match the condition, it will be 0.
         */
        if(response === 0) {
            throw new AppError('Not able to find the resource to update', StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = CrudRepository;