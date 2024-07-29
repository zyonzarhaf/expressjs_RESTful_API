import jwt from 'jsonwebtoken';

function jwtSignAsync (payload = {}, secret, options = {}) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) { 
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

export default jwtSignAsync;
