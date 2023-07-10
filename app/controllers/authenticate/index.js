let jwt = require("jsonwebtoken");
const config = require("../../config/authConfig");

const logger = require("../../utils/logger")
const resData = require("../../utils/dataResponse")
const validate=require("../../utils/validationKeyValue")
const authModule = require("../../models/authenticate")
let path='/controllers/authenticate/index';

var indexController = module.exports = {

    loginUser: async function (req, res, next) {
        try {
            
            console.log('enter signin User...@@')
            let resp = await resData(req, res, next);
            let requiredFields = ['userName', 'password', 'captcha', 'sessionCaptcha']
            let params = req.body;
            const validateRes = validate.keyAndValueValidate(requiredFields, params);
            if (validateRes) {
                const userCaptcha = params.captcha;
                if (userCaptcha === params.sessionCaptcha) {
                    let verifyUser = await authModule.validatedUser(params)
                    if (verifyUser) {
                        let userData = await authModule.getUserData(params);
                        var token = jwt.sign({ data: userData[0] }, config.secret, {
                            //expiresIn: 86400, // 24 hours
                        });
                        let dataResponse = {
                            status: resp.successCode,
                            message: resp.success.LOGIN,
                            responseData: {
                                authToken: token
                            }
                        }
                        logger.info(`${path} - loginUser()- ${JSON.stringify(dataResponse)}`)
                        res.status(200).send(dataResponse);
                    } else {
                        let dataResponse = {
                            status: resp.errorCode,
                            message: resp.error.LOGIN,
                            responseData: {}
                        }
                        logger.info(`${path} - loginUser()- ${JSON.stringify(dataResponse)}`)
                        res.status(200).send(dataResponse);
                    }
                } else {
                    let dataResponse = {
                        status: resp.errorCode,
                        message: resp.error.CAPTCHA + resp.error.COMMON_MSG,
                        responseData: {}
                    }
                    logger.info(`${path} - loginUser()- ${JSON.stringify(dataResponse)}`)
                    res.status(200).send(dataResponse);
                }
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.VALIDATION_KEY_VALUE,
                    responseData: {}
                }
                logger.info(`${path}- loginUser()- ${JSON.stringify(dataResponse)}`)
                res.status(200).send(dataResponse);
            }
        } catch (err) {
            logger.error(`${path} ${err}`)
        }

    }
}