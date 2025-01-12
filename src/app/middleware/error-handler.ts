import { type NextFunction, Request, Response } from 'express';
import { APIError, InternalError } from '../errors';
import { getLogger } from '../utils';

const logger = getLogger({
  layer: 'middleware',
  function: 'errorHandler',
});

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let apiError: APIError = new InternalError();

  if (err instanceof APIError) {
    apiError = err;
  } else {
    logger.error(err, 'Unknown error');
  }

  res.status(apiError.getStatusCode()).json(apiError.asModel());
}
