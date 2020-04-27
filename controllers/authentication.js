
let jwt = require('jsonwebtoken');
let jwtSECRET = 'thisisthesecret';
let jwtEXPIRY = '1h';
const expressBasicAuth = require('express-basic-auth');

exports.getSignedToken = (req, res) => {
    try {
        let payload = req.body || req.body.payload || req.query.payload || req.headers['x-payload'];
        if (!!payload) {
            let generatedToken = jwt.sign({ data: payload }, jwtSECRET, { expiresIn: jwtEXPIRY });
            return res.status(200).json({ status: 200, token: generatedToken });
        } else {
            return res.status(400).json({ status: 400, message: 'No payload found' });
        }
    }catch(e){
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.basicAuth = (req, res, next) => {
    // make index path public
    if (req.path === '/') {
        return next();
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ status: 401, message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const user = this.basicAuthenticator(username, password);

    if (!user) {
        return res.status(401).json({ status: 401, message: 'Invalid Authentication Credentials' });
    }

    // attach user to request object
    req.user = user

    next();
}


exports.basicAuthenticator = (username, password) => {
    try {
        const userMatches = expressBasicAuth.safeCompare(username, 'customuser');
        const passwordMatches = expressBasicAuth.safeCompare(password, 'custompassword');
        return userMatches & passwordMatches;
    } catch (e) {
        return false;
    }
}

/**
 * Authenticator middleware
 * JWT Authentication
 * Basic Authentication
 * Condition-1: If token is found it will authenticate with jwt auth; 
 * Condition-2: If token is not found it will authenticate with basic auth;
 */
exports.authenticate = (req, res, next) => {

    let token = req.body.token || req.query.token || req.headers['x-token'];

    if (token) {
        try {
            jwt.verify(token, jwtSECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ status: false, message: 'Failed To authenticate' });
                }
                else {
                    req.validToken = decoded;
                    next();
                }
            });
        } catch (e) {
            return res.status(401).send({
                status: false,
                message: e.message
            });
        }
    } else {
        this.basicAuth(req, res, next);
    }
}
