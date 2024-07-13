function allowOrigin (req, res, next) {
    const origin = req.headers.origin || '*';

    res.set({
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS, XMODIFY',
        'Access-Control-Allow-Credntials': true,
        'Access-Control-Max-Age': 86400, 
        'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
    });

    next();
}

export default allowOrigin;
