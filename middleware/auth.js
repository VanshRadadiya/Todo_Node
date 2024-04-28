var jwt = require('jsonwebtoken');

exports.auth_check = async (req, res, next) => {
    jwt.verify(req.headers.authorization, 'secretkey',next)
}

exports.auth1_check = async (req, res, next) => {
    jwt.verify(req.headers.authorization, 'userkey',next)
}