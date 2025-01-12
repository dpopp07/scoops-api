import { type NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors';
import { getLogger } from '../utils';

const logger = getLogger({
  layer: 'middleware',
  function: 'isAdmin',
});

export function isAdmin(req: Request, _res: Response, next: NextFunction) {
  const { user } = req;

  const loggerContext = {
    user,
  };

  logger.info(loggerContext, 'Admin privileges required - authorizing request');

  if (!user) {
    logger.error(
      loggerContext,
      'Request does not have a user associated with it',
    );
    throw new NotAuthorizedError();
  }

  if (!user.isAdmin) {
    logger.error(loggerContext, 'User is not an admin - request denied');
    throw new NotAuthorizedError();
  }

  logger.info(loggerContext, 'Admin privileges confirmed, request authorized');

  next();
}
