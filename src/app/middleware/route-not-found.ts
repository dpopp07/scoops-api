import { type NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors';
import { getLogger } from '../utils';

const logger = getLogger({
  layer: 'middleware',
  function: 'routeNotFound',
});

export function routeNotFound(
  req: Request,
  _res: Response,
  _next: NextFunction,
) {
  logger.error({ route: req.originalUrl }, 'Requested route not found');
  throw new NotFoundError();
}
