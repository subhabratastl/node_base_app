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

const path = '/controllers/authenticate/authController';

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
                            logger.info(`${path} - loginUser()- ${JSON.stringify(dataResponse)}`)
                            res.status(200).send(dataResponse);
                        }else{
                            let dataResponse = {
                                status: resp.errorCode,
                                message: resp.error.LOGIN,
                                responseData: {}
                            }
                            logger.error(`${path} - loginUser()- ${JSON.stringify(dataResponse)}`)
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
            logger.error(`${path} ${err}`)
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
            logger.error(`${path} ${err}`)
        }
    },

    forgetPaswrd: async function (req, res, next) {
        console.log("forget Password....................");
        try {
            let params = req.body;
            if (params.op_type == 'GET_OTP' || params.op_type == 'RESEND_OTP') {
                console.log('enterrrrr otp');
                const currentTime = moment();
                const newTime = currentTime.add(5, 'minutes');
                params.expirTime = newTime.format('YYYY-MM-DD HH:mm:ss');
                params.otp = parseInt(otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false, }));
                let otpGet = await authModule.otpCreateOrUpdate(params);
                if (otpGet.success) {
                    let sendEmail = await authController.getDataForSendOTPtoEmail(params);
                    console.log('sendEmail............', sendEmail);
                    if (sendEmail.success) {
                        let dataResponse = {
                            status: "000",
                            message: "OTP Send to your register Email Id",
                            responseData: Object.assign({}, ...sendEmail.data)
                        }
                        res.status(200).send(dataResponse)
                    } else {
                        let dataResponse = {
                            status: false,
                            message: "OTP not Send to your register Email Id",
                            responseData: {}
                        }
                        res.status(200).send(dataResponse)
                    }
                }

            } else if (params.op_type == 'VERIFY_OTP') {
                console.log('Verify otp');
                console.log('paramsssss....verify', params);
                const verifyOtp = await authModule.verifyOtpFromMail(params);
                console.log('verify otp after model............', verifyOtp);
                if (verifyOtp.Otp_match == 1 && verifyOtp.expire_status == 1) {
                    console.log('if case OTP match...')
                    let dataResponse = {
                        status: "000",
                        message: "OTP Verified Successfully",
                        responseData: {}
                    }
                    res.status(200).send(dataResponse)
                } else {
                    let dataResponse = {
                        status: false,
                        message: "OTP  Not Verified, Please try again",
                        responseData: {}
                    }
                    res.status(200).send(dataResponse)
                }
            } else if (params.op_type == 'PASSWORD_CHANGE') {
                console.log('params....', params);
                let result = await authModule.passwordUpdate(params)
                if (result.success) {
                    let dataResponse = {
                        status: "000",
                        message: "Password change successfully",
                        responseData: {}
                    }
                    res.status(200).send(dataResponse)
                } else {
                    let dataResponse = {
                        status: false,
                        message: "Password not change successfully",
                        responseData: {}
                    }
                    res.status(200).send(dataResponse)
                }

            }
        } catch (err) {
            console.log('forget password.. ', err);
        }

    },

    getDataForSendOTPtoEmail: async function (params) {
        try {
            let result = await authModule.getDataForEmail(params);
            console.log('get adata send OTP email..', result);
            const mailOptions = {
                from: mailConfig.stl_mail,
                to: result[0].email_id,
                subject: 'STL- OTP Send',
                text: `Test OTP .${params.otp}`
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                //console.log('Email sent:', info.response);
                logger.info(`${path}-getDataForSendOTPtoEmail()-${info.response}`)
                return { success: true, message: 'OTP send successfully', data: result };
            } catch (error) {
                console.log('Error:', error);
                logger.error(`${path}-getDataForSendOTPtoEmail()-${error}`)
                return { success: false, message: 'OTP not send' };
            }
        } catch (err) {
            console.log('get data for email', err)
        }

    },
}