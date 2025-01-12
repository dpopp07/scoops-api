import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v7 as uuid } from 'uuid';

import { DefinedError } from 'ajv';
import { ValidationError } from '../errors';
import { users as userStore } from '../model/database/controllers';
import { validateUser } from '../model/schemas';
import type { User, UserPrototype, UserWithToken } from '../model/types';
import { config, getLogger, parseAjvErrors } from '../utils';
import { Token } from '../utils/token';

const logger = getLogger({
  layer: 'controller',
  resource: 'user',
});

export async function register(req: Request, res: Response) {
  const newUser: UserPrototype = req.body;

  const loggerContext = {
    user: newUser,
  };

  logger.info(loggerContext, 'Registering user');

  if (!validateUser(newUser)) {
    const validationMessage = `Invalid user: ${parseAjvErrors(validateUser.errors as DefinedError[])}`;
    logger.error(loggerContext, validationMessage);
    throw new ValidationError(validationMessage, 400);
  }

  const userInfo: User = {
    id: uuid(),
    ...newUser,
  };

  logger.info(loggerContext, 'Signing and hashing user information');
  const token = jwt.sign(userInfo, config.JWT_KEY);
  const hashedToken = Token.hash(token);

  await userStore.create({
    ...userInfo,
    token: hashedToken,
  });

  const createdUser: UserWithToken = {
    ...userInfo,
    token,
  };

  logger.info({ user: createdUser }, 'Responding with created user');
  res.status(201).json(createdUser);
}
