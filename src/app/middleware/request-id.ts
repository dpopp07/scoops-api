import { type NextFunction, Request, Response } from 'express';
import { v7 as uuid } from 'uuid';
import { getLogger } from '../utils';

const logger = getLogger({
  layer: 'middleware',
  function: 'requestId',
});

export function requestId(req: Request, res: Response, next: NextFunction) {
  const requestId = uuid();
  logger.trace({ requestId }, 'Generated ID for request');
  req.id = requestId;
  res.set('X-Request-Id', requestId);
  next();
}
