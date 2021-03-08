const winston = require("winston");
const path = require("path");

module.exports = {
  development: {
    level: "debug",
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  },
  test: {
    level: "verbose",
    transports: [
      new winston.transports.File({
        filename: path.join(process.cwd(), "/log/combined.log"),
        level: "error"
      })
    ]
  },
  staging: {
    level: "verbose",
    transports: [
      new winston.transports.File({
        filename: path.join(process.cwd(), "/log/combined.log"),
        level: "error"
      })
    ]
  },
  production: {
    level: "verbose",
    transports: [
      new winston.transports.File({
        filename: path.join(process.cwd(), "/log/error.log"),
        level: "error"
      }),
      new winston.transports.File({
        filename: path.join(process.cwd(), "/log/combined.log"),
        level: "verbose"
      })
    ]
  }
}
