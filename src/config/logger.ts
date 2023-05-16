import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // error with indentation
    new winston.transports.File({
      level: "error",
      filename: "logs/error.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
      )
    })
  ]
});

export default logger;