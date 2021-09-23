import path from 'path';
import winston from 'winston';

const options = {
  file: {
    level: 'info',
    filename: `${path.resolve(__dirname, '../../logs')}/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [new winston.transports.File(options.file), new winston.transports.Console(options.console)],
  exitOnError: false, // do not exit on handled exceptions
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export const stream = logger.stream();

export default logger;
