import { body } from 'express-validator';

const registerRules = [
    body(['firstName', 'lastName'])
        .trim()
        .notEmpty()
        .withMessage('missing name'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('missing email')
        .bail()
        .isEmail()
        .withMessage('not a valid email'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('missing password')
        .bail()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/)
        .withMessage(`
            password must meet the following criteria:
            - at least one digit (0-9)
            - at least one lowercase letter (a-z)
            - at least one uppercase letter (A-Z)
            - at least one special character (e.g., !@#$%^&*)
            - minimum length of 8 characters`
        )
];

const updateRules = [
    body(['firstName', 'lastName'])
        .if((req) => req.body.firstName || req.body.lastName)
        .trim()
        .notEmpty()
        .withMessage('missing name'),
    body('email')
        .if(body('email').exists())
        .trim()
        .notEmpty()
        .withMessage('missing email')
        .bail()
        .isEmail()
        .withMessage('not a valid email'),
    body('password')
        .if(body('password').exists())
        .trim()
        .notEmpty()
        .withMessage('missing password')
        .bail()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/)
        .withMessage(`
            password must meet the following criteria:
            - at least one digit (0-9)
            - at least one lowercase letter (a-z)
            - at least one uppercase letter (A-Z)
            - at least one special character (e.g., !@#$%^&*)
            - minimum length of 8 characters`
        )
];

const loginRules = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('missing email')
        .bail()
        .isEmail()
        .withMessage('not a valid email'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('missing password')
];

export {
    registerRules,
    updateRules,
    loginRules
};
