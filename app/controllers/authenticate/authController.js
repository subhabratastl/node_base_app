let jwt = require("jsonwebtoken");
const config = require("../../config/authConfig");

const logger = require("../../utils/logger")
const resData = require("../../utils/dataResponse")
const validate = require("../../utils/validationKeyValue")
const authModule = require("../../models/authenticate")
const transporter = require("../../services/mailSetup")
var mailConfig = require("../../config/mailConfig.json")
const moment = require('moment');
const otpGenerator = require('otp-generator')

const path = '/controllers/authenticate/authController/-';

var authController = module.exports = {

    loginUser: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            let requiredFields = ['userName', 'password', 'captcha', 'sessionCaptcha']
            let params = req.body;
            const validateRes = validate.keyAndValueValidate(requiredFields, params);
            if (validateRes) {
                const userCaptcha = params.captcha;
                if (userCaptcha === params.sessionCaptcha) {
                    let verifyUser = await authModule.validatedUser(params)
                    if (verifyUser) {
                        let userDatas = await authModule.getUserData(params);
                        if (userDatas.success) {
                            let userData = userDatas.data;
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
                            logger.info(`${path}loginUser()- ${JSON.stringify(dataResponse)}`)
                            res.status(200).send(dataResponse);
                        } else {
                            let dataResponse = {
                                status: resp.errorCode,
                                message: resp.error.LOGIN,
                                responseData: {}
                            }
                            logger.error(`${path} loginUser()- ${JSON.stringify(dataResponse)}`)
                            res.status(200).send(dataResponse);
                        }

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
            logger.error(`${path} loginUser()-${err}`)
        }
    },

    signout: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            delete req.headers['authorization'];
            let dataResponse = {
                status: resp.successCode,
                message: resp.success.LOGOUT,
                responseData: {}
            }
            console.log()
            res.status(200).send(dataResponse);
        } catch (err) {
            logger.error(`${path}signout()- ${err}`)
        }
    },

    forgetPaswrd: async function (req, res, next) {
        try {
            let resp = await resData(req, res, next);
            let requiredFields = ['op_type']
            let params = req.body;
            const validateRes = validate.keyAndValueValidate(requiredFields, params);
            if (validateRes) {
                if (params.op_type == 'GET_OTP' || params.op_type == 'RESEND_OTP') {
                    try {
                        const currentTime = moment();
                        const newTime = currentTime.add(5, 'minutes');
                        params.expirTime = newTime.format('YYYY-MM-DD HH:mm:ss');
                        params.otp = parseInt(otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false, }));
                        let otpGet = await authModule.otpCreateOrUpdate(params);
                        if (otpGet.success) {
                            let sendEmail = await authController.getDataForSendOTPtoEmail(params);
                            if (sendEmail.success) {
                                let dataResponse = {
                                    status: resp.successCode,
                                    message: resp.success.OTP_SEND_TO_EMAIL,
                                    responseData: Object.assign({}, ...sendEmail.data)
                                }
                                res.status(200).send(dataResponse)
                            } else {
                                let dataResponse = {
                                    status: resp.errorCode,
                                    message: resp.error.OTP_SEND_TO_EMAIL + resp.error.COMMON_MSG,
                                    responseData: {}
                                }
                                res.status(200).send(dataResponse)
                            }
                        }
                    } catch (err) {
                        logger.error(`${path}forgetPaswrd()- ${err}`)
                    }


                } else if (params.op_type == 'VERIFY_OTP') {
                    try {
                        const verifyOtp = await authModule.verifyOtpFromMail(params);
                        if (verifyOtp.Otp_match == 1 && verifyOtp.expire_status == 1) {
                            let dataResponse = {
                                status: resp.successCode,
                                message: resp.success.OTP_VERIFY,
                                responseData: {}
                            }
                            res.status(200).send(dataResponse)
                        } else {
                            let dataResponse = {
                                status: resp.errorCode,
                                message: resp.error.OTP_VERIFY + resp.error.COMMON_MSG,
                                responseData: {}
                            }
                            res.status(200).send(dataResponse)
                        }
                    } catch (err) {
                        logger.error(`${path}forgetPaswrd()- ${err}`)
                    }

                } else if (params.op_type == 'PASSWORD_CHANGE') {
                    try {
                        let result = await authModule.passwordUpdate(params)
                        if (result.success) {
                            let dataResponse = {
                                status: resp.successCode,
                                message: resp.success.PASSWORD_CHANGE,
                                responseData: {}
                            }
                            res.status(200).send(dataResponse)
                        } else {
                            let dataResponse = {
                                status: resp.errorCode,
                                message: resp.error.PASSWORD_CHANGE,
                                responseData: {}
                            }
                            res.status(200).send(dataResponse)
                        }
                    } catch (err) {
                        logger.error(`${path}forgetPaswrd()- ${err}`)
                    }
                }
            } else {
                let dataResponse = {
                    status: resp.errorCode,
                    message: resp.error.VALIDATION_KEY_VALUE,
                    responseData: {}
                }
                logger.info(`${path}- forgetPaswrd()- ${JSON.stringify(dataResponse)}`)
                res.status(200).send(dataResponse);
            }

        } catch (err) {
            logger.error(`${path}forgetPaswrd()- ${err}`)
        }
    },

    getDataForSendOTPtoEmail: async function (params) {
        try {
            let result = await authModule.getDataForEmail(params);
            const mailOptions = {
                from: mailConfig.stl_mail,
                to: result[0].email_id,
                subject: 'STL- OTP Send',
                text: `Test OTP .${params.otp}`
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                logger.info(`${path}getDataForSendOTPtoEmail()-${info.response}`)
                return { success: true, message: 'OTP send successfully', data: result };
            } catch (error) {
                logger.error(`${path}getDataForSendOTPtoEmail()-${error}`)
                return { success: false, message: 'OTP not send' };
            }
        } catch (err) {
            logger.error(`${path}getDataForSendOTPtoEmail()- ${err}`)
        }

    },
}