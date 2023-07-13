const logger = require("./logger")
const path = '/utils/captchaSetup/-';

var svgCaptcha = require('svg-captcha');

let captchaSetup = module.exports = {
    captchCreate:  function (req, res, next) {
        try {
            const options = {
                size: 4,
                charPreset: '1234567890',
            };
            var captcha = svgCaptcha.create(options);
            //req.session.captcha = captcha.text;
            //console.log('req.session.captcha @@@@@@@@@@@', req.session.captcha);
            //req.session.captcha="Hello"  
            //res.setHeader('Content-Type', 'image/svg+xml');
            let dataResponse = {
                status: "000",
                message: "OK",
                responseData: captcha
            }
            logger.info(`${path}-captchCreate- ${JSON.stringify(dataResponse)}`)
            res.status(200).send(dataResponse);
        } catch (err) {
            logger.error(`${path}-captchCreate- ${err}`)
        }
    }
}