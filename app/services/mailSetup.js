const nodemailer = require('nodemailer');
var mailConfig = require("../config/mailConfig.json")

const transporter = nodemailer.createTransport({
    // host: generalConfig.stl_mail_host,
    // port: generalConfig.stl_mail_port,
    // secure: generalConfig.stl_secure, 
    service: mailConfig.stl_service,
    auth: {
        user: mailConfig.stl_mail_user,
        pass: mailConfig.stl_mail_pass
    }
});

module.exports=transporter;