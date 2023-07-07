const winston = require('winston');
const moment = require('moment-timezone');
const timeZone = require('./timezone');
const fs = require('fs-extra')

const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const region = timeZone();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      const timestamp = moment.tz(info.timestamp, region).format();
      return `${timestamp} ${info.level}: ${info.message}`;
    })
  ),
  transports: [

    new winston.transports.File({
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
      zippedArchive: true,
      timestamp: true,
      filename: getLogFileName('combined'),
    }),
    new winston.transports.File({
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
      zippedArchive: true,
      timestamp: true,
      filename: getLogFileName('error'),
    }),
  ],
});

function getLogFileName(type) {
  const currentDate = moment().format('YYYY-MM-DD');
  return `${logsDir}/${currentDate}-${type}.log`;
}

function createNewLogFile() {
  const currentDate = moment().format('YYYY-MM-DD');
  const combinedLogFile = getLogFileName('combined');
  const errorLogFile = getLogFileName('error');

  const combinedTransport = logger.transports.find(t => t.filename && t.filename.includes('combined'));
  const errorTransport = logger.transports.find(t => t.filename && t.filename.includes('error'));

  if (!fs.existsSync(combinedLogFile) && combinedTransport) {
    combinedTransport.filename = combinedLogFile;
    logger.info('Created new combined log file: ' + combinedLogFile);
  }

  if (!fs.existsSync(errorLogFile) && errorTransport) {
    errorTransport.filename = errorLogFile;
    logger.info('Created new error log file: ' + errorLogFile);
  }

  if (combinedTransport && currentDate !== moment(combinedTransport.filename).format('YYYY-MM-DD')) {
    combinedTransport.filename = getLogFileName('combined');
    logger.info('Switching combined log file to: ' + combinedTransport.filename);
  }

  if (errorTransport && currentDate !== moment(errorTransport.filename).format('YYYY-MM-DD')) {
    errorTransport.filename = getLogFileName('error');
    logger.info('Switching error log file to: ' + errorTransport.filename);
  }
}
setInterval(createNewLogFile, 60 * 60 * 1000);

// const midnight = moment().endOf('day').valueOf();
// const delay = midnight - Date.now();
// setTimeout(() => {
//   switchLogFileAtMidnight();
//   setInterval(switchLogFileAtMidnight, 24 * 60 * 60 * 1000); // Repeat every 24 hours
// }, delay);

module.exports = logger;
