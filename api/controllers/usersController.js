import * as User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import tryCatchWrapper from '../../utils/tryCatchWrapper.js';
import httpStatus from 'http-status-codes';
import APIError from '../../errors/APIError.js';

const register = tryCatchWrapper(async function (req, res, next) {
    try {
        const user = await User.create(req.body);
        res.status(httpStatus.CREATED).json({ user });
    } catch (err) {
        throw new APIError({
            message: `Duplicate value(s): ${Object.keys(err.keyValue)} already taken`,
            status: httpStatus.CONFLICT
        });
    }
});

const update = tryCatchWrapper(async function (req, res, next) {
    const { userId: _id } = req.params;
    const user = await User.update({ _id }, req.body);

    if (!user) throw new APIError({
        message: 'User not found',
        status: httpStatus.NOT_FOUND
    });

    res.status(httpStatus.OK).json({ user });
});

const remove = tryCatchWrapper(async function (req, res, next) {
    const { userId: _id } = req.params;
    const result = await User.remove({ _id });

    if (!result.deletedCount) throw new APIError({
        message: 'User not found',
        status: httpStatus.NOT_FOUND
    });

    res.status(httpStatus.OK).json({ success: true });
});

const get = tryCatchWrapper(async function (req, res, next) {
    const { userId: _id } = req.params;
    const user = await User.get({ _id });

    if (!user) throw new APIError({
        message: 'User not found',
        status: httpStatus.NOT_FOUND
    });

    res.status(httpStatus.OK).json({ user });
});

const list = tryCatchWrapper(async function (req, res, next) {
    const { offset, limit } = req.query;
    const users = await User.list({ offset, limit });

    /**
    * Retorna uma lista vazia se não forem 
    * encontrados documentos na coleção
    * */
    res.status(httpStatus.OK).json({ users });
});

const login = tryCatchWrapper(async function (req, res, next) {
    const { email, password } = req.body;
    const user = await User.get({ email });

    if (!user || !User.verifyPassword(password, user.password, user.salt)) {
        throw new APIError({
            message: 'Incorrect email or password',
            status: httpStatus.UNAUTHORIZED
        });
    }

    jwt.sign(
        {
            sub: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            iat: Date.now()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '3d'
        },
        (err, token) => {
            if (err) throw new APIError({
                message: 'Failed to sign the authentication token.'
            });

            res.send({ token });
        }
    );
});

const logout = tryCatchWrapper(function (req, res, next) {
    console.log('hello from logout');
    res.json({ success: true });
})

export { 
    register,
    update,
    remove,
    get,
    list,
    login,
    logout
};
