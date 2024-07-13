import ExtendableError from './ExtendableError.js';
import httpStatusCodes from 'http-status-codes';

class APIError extends ExtendableError {
    constructor({
        message,
        errors,
        status = httpStatusCodes.INTERNAL_SERVER_ERROR,
        isPublic = false,
        isOperational = true,
        stack
    }) {
        super({
            message,
            errors,
            status,
            isPublic, 
            isOperational,
            stack
        });
    }
}

export default APIError;
