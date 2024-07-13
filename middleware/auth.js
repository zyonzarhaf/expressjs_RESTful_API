import 'dotenv/config';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import APIError from '../errors/APIError.js';

function verifyToken (req, res, next) {
    const token = req.get('Authorization')?.split(' ')[1] || null;

    if (token === null) {
        return next(
            new APIError({
                message: 'missing token',
                status: httpStatus.BAD_REQUEST
            })
        );
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        function (err, user) {
            if (err) {
                return next(
                    new APIError({
                        message: 'invalid token',
                        status: httpStatus.UNAUTHORIZED
                    })
                );
            }

            req.user = user;
        }
    );

    next();
}

function ensureCredentials (req, res, next) {
    const { userId } = req.params || {};
    const { sub, role } = req.user || {};

    function isAdmin () {
        return role === 'admin';
    }

    function isUser () {
        return userId && userId === sub && role === 'user';
    }

    if (!isAdmin() || !isUser()) {
        return next(
            new APIError({
                message: 'Unauthorized access',
                status: httpStatus.UNAUTHORIZED,
            })
        );
    }

    next();
}

export { 
    verifyToken,
    ensureCredentials
};
