import 'dotenv/config';
import httpStatus from 'http-status-codes';
import APIError from '../errors/APIError.js';

function handler (err, req, res, next) {
    const development = process.env.ENV === 'development';

    const response = {
        message: err.message,
        errors: err.errors,
        status: err.status,
        stack: err.stack
    }

    if (!development) delete response.stack;

    return res.status(response.status).json(response);
}

function converter (err, req, res, next) {
    if (!(err instanceof APIError)) { 
        const error = new APIError({
            message: err.message,
            status: err.status,
            stack: err.stack
        });

        return next(error);
    }

    next(err);
}

function notFound (req, res, next) {
    const error = new APIError({
        message: 'Resource was not found',
        status: httpStatus.NOT_FOUND
    });

    next(error);
}

export { handler, converter, notFound };
