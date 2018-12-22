const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Verification JWT
exports.VerifyToken = function(req, res, next){

    const token = req.cookies.auth || req.headers.authorization.split(' ')[1];
    // const token = req.cookies.auth;
    // console.log("auth midle - token: ", token)


    if(!req.headers.authorization){
        return res.status(403).json({ success: false, message: 'Non Authorization!!!'});
    }

    if(!token){
        return res.status(403).json({ success: false, message: 'No token!!!'});
    }else{
        return jwt.verify(token, config.secret, function(err, decoded){
            if(err){
                if(err.expiredAt < new Date()){
                    return res.status(500).json({ success: false, message: 'Token has expired. Please login again!!!', token: null});
                }
                next();
            }
            req.user = decoded.user;
            next();
        })
    }

};

