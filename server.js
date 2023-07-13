const express = require("express")
const bodyParser = require('body-parser');
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require('express-rate-limit')
const logger = require('./app/utils/logger');
const dbConnection = require("./app/models/connection")
const indexGetApi= require("./app/routes/indexGet")
const indexPostApi= require("./app/routes/indexPost")
// var svgCaptcha = require('svg-captcha');
const session = require('express-session');
// const sessionSecret = require('./app/config/authConfig')

const app = express();
app.use(helmet());

const devPORT = 8001
const baseUrl = process.env.BASE_URL || `http://localhost:${devPORT}`;

var corsOptions = {
    origin: baseUrl
};

//app.use(cors(corsOptions));
app.use(cors());

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: false }));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

// app.use(session({
//     secret: sessionSecret.sessionSecret,
//     resave: false,
//     saveUninitialized: true
// }));

app.use('/api/auth',indexGetApi);
app.use('/api/auth',indexPostApi);
require("./app/routes/indexGet",indexGetApi);
require("./app/routes/indexPost",indexPostApi);

const PORT = process.env.PORT || devPORT;
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Node base application." });
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}.`);
    dbConnection.checkConnection();
});