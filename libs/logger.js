const winston = require('winston');

const getLogger = (module) => {
  const path = module.filename.split('/').slice(-2).join('/');
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: '../logs/error.log',
        level: 'error',
        label: path,
      }),
      new winston.transports.File({
        filename: '../logs/combined.log',
        label: path,
      }),
    ],
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.label({
          label: path,
        }),
        winston.format.colorize(),
        winston.format.printf(info => `${info.level}: [${info.label}] ${info.message}`),
      ),
      level: 'debug',
    }));
  }
  return logger;
};

module.exports = getLogger;
