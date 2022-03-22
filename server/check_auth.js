var jwt = require('jsonwebtoken');
const config = require('./config');

const authentication = (req, res, next) => {
    let token = req.headers.authorization
    jwt.verify(token, config.JWT_SECRET_KEY, function (err, decoded) {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized!' });
        } else {
            req.auth = {};
            req.auth.decoded = decoded;
            next();
        }
    });
};

module.exports = authentication;