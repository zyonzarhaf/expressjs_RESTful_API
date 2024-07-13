import { validationResult } from 'express-validator';
import httpStatus from 'http-status-codes';
import APIError from '../errors/APIError.js';

function validate (validationRules) {
    return async function (req, res, next) {
        await Promise.all(validationRules.map(rule => rule.run(req))); 

        const errors = validationResult(req).array();

        if (errors.length) {
            throw new APIError({
                message: 'validation error',
                status: httpStatus.BAD_REQUEST,
                errors: errors
            });
        }

        next();
    }
}

export default validate;
