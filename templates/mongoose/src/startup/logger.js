import winston from 'winston';

const { format } = winston;
const { combine, timestamp, prettyPrint } = format;

class Logger {
  constructor() {
    winston.add(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: combine(timestamp(), prettyPrint()),
      })
    );

    winston.add(
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: combine(timestamp(), prettyPrint()),
      })
    );

    winston.exceptions.handle(
      new winston.transports.File({
        filename: 'logs/exceptions.log',
        format: combine(timestamp(), prettyPrint()),
      })
    );

    process.on('unhandledRejection', ex => {
      throw ex;
    });
  }
}

export default new Logger();
