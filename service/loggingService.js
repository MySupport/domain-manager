const { createLogger, format, transports } = require('winston');
const { isDev, logFileName } = require('../config');
const { combine, timestamp, printf } = format;

const formatSyslog = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    timestamp(),
    formatSyslog
  ),
  transports: [new transports.File({ filename: logFileName }), new transports.Console()]
});

// logger.transports.push(new transports.Console());

exports.setLogLevel = (level = 'verbose') => logger.level = level;

exports.logError = msg => logger.error(msg);
exports.logWarning = msg => logger.warn(msg);
exports.logInfo = msg => logger.info(msg);
exports.logVerbose = msg => logger.verbose(msg);
exports.logDebug = msg => logger.debug(msg);
exports.logSilly = msg => logger.silly(msg);
