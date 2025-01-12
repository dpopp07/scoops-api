import { Request, Response } from 'express';
import PinoHttp, { Options } from 'pino-http';
import { config, getLogger } from '../utils';

const logger = getLogger({
  layer: 'middleware',
  function: 'requestLogger',
});

const loggerOptions: Options = {
  logger,
  redact: ['req.headers.authorization'],
  customSuccessMessage: () => {
    return `Request completed`;
  },
};

// Remove a bunch of information to make the development
// logs more sparse and readable.
if (config.DEVELOPMENT_LOGGING) {
  loggerOptions.serializers = {
    req(req: Request) {
      const { id, method, url } = req;
      return { id, method, url };
    },
    res(res: Response) {
      const { statusCode } = res;
      return { statusCode };
    },
  };
}

export const requestLogger = PinoHttp(loggerOptions);
