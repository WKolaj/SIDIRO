import winston, { createLogger, format, transports } from "winston";
import { config } from "node-config-ts";

let logger:
  | null
  | winston.Logger
  | { info: Function; error: Function; warn: Function } = null;

//Logger for console will not be displayed as json, but it will be colorized
//Moreover - logging on console is not active on production enviroment!!
//For test enviroment - log only erros and warnings
if (process.env.NODE_ENV === "production") {
  logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.File({
        filename: config.logging.error.path,
        level: "error",
        maxsize: config.logging.error.maxsize,
        maxFiles: config.logging.error.maxFiles,
        handleExceptions: true,
      }),
      new transports.File({
        filename: config.logging.warning.path,
        level: "warn",
        maxsize: config.logging.warning.maxsize,
        maxFiles: config.logging.warning.maxFiles,
      }),
      new transports.File({
        filename: config.logging.info.path,
        maxsize: config.logging.info.maxsize,
        maxFiles: config.logging.info.maxFiles,
      }),
    ],
  });
} else if (process.env.NODE_ENV === "test") {
  logger = {
    info: () => {},
    error: (_: string, errorDetails: any) => {
      console.log(errorDetails);
    },
    warn: (_: string, errorDetails: any) => {
      console.log(errorDetails);
    },
  };
} else {
  logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
        handleExceptions: true,
      }),
    ],
  });
}

export default logger as
  | winston.Logger
  | { info: Function; error: Function; warn: Function };
