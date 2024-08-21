class AppError extends Error {              // To throw custom error by making object of AppError class and passing(message, statusCode) and improve consistency
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.explanation = message
    }
}

module.exports = AppError;