const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const db = require("../models/connection");
const logger=require("../utils/logger")
const msgData = require("../utils/message.json");
const statusCode = require("../utils/statusCode.json");

verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    let language = req.lang;
    let msgError = msgData[language].error;

    if (!token) {
        let dataResponse = {
            status: statusCode.ERROR,
            message: msgError.TOKEN_CHECK + msgError.COMMON_MSG,
            responseData: {}
        }
        logger.info(`auth JWT.. ${JSON.stringify(dataResponse)}`);
        return res.status(200).send(dataResponse);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            let dataResponse = {
                status: statusCode.ERROR,
                message: msgError.TOKEN_VALIDATION + msgError.COMMON_MSG,
                responseData: {}
            }
            logger.info(`auth JWT verify ${JSON.stringify(dataResponse)}`);
            return res.status(200).send(dataResponse);
        }
        req.userCode = decoded.data.user_code;
        req.roleCodeData = decoded.data.role_code;
        next();
    });
};

const authJwt = {
    verifyToken
};
module.exports = authJwt;