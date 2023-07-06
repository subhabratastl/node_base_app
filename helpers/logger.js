const winston = require('winston');
const moment = require('moment-timezone');
const timeZone = require('./timezone');

const region=timeZone();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      const timestamp = moment.tz(info.timestamp, region).format();
      return `${timestamp} ${info.level}: ${info.message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(), // Output logs to console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Output error logs to a file
    new winston.transports.File({ filename: 'logs/combined.log' }) // Output all logs to a file
  ]
});

module.exports = logger;
