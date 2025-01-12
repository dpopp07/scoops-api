import { type NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../errors';
import { users as userStore } from '../model/database/controllers';
import { User } from '../model/types';
import { config, getLogger } from '../utils';
import { Token } from '../utils/token';

const headerPrefix = 'Bearer ';

const logger = getLogger({
  layer: 'middleware',
  function: 'authenticate',
});

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  logger.trace('Attempting to authenticate request');

  const authHeader = req.get('authorization');

  if (!authHeader || !authHeader.startsWith(headerPrefix)) {
    logger.error(`Invalid value for Authorization header: ${authHeader}`);
    throw new NotAuthorizedError();
  }

  logger.trace('Read Authorization header, verifying token');

  const token = authHeader.split(headerPrefix)[1];
  let user: User;

  try {
    user = jwt.verify(token, config.JWT_KEY) as User;
  } catch (err) {
    logger.error(err, 'Failed to verify token');
    throw new NotAuthorizedError();
  }

  const loggerContext = {
    user,
  };

  logger.trace(loggerContext, 'Verified and decoded token, looking up user');

  const storedUser = await userStore.get(user.id);
  if (!storedUser) {
    logger.error('No user found, could not authenticate request');
    throw new NotAuthorizedError();
  }

  logger.trace(loggerContext, 'Confirming user authorization');

  if (!Token.compare(storedUser.token, token)) {
    logger.error('Supplied token does match stored, could not authorize user');
    throw new NotAuthorizedError();
  }

  logger.trace(loggerContext, 'Successfully authenticated request');

  // Set user information on the request object.
  req.user = user;

  next();
}
