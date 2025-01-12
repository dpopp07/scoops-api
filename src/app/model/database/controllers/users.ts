import { getLogger } from '../../../utils';
import { UserWithToken } from '../../types';
import { insertUser, selectUser } from '../queries/users';

const logger = getLogger({
  layer: 'data',
  resource: 'user',
});

export async function create(user: UserWithToken) {
  const loggerContext = {
    user,
  };

  logger.trace(loggerContext, 'Storing new user');

  await insertUser(user);

  logger.trace(loggerContext, 'Successfully stored new user');
}

export async function get(userId: string): Promise<UserWithToken | undefined> {
  const loggerContext = {
    userId,
  };

  logger.trace(loggerContext, 'Looking up user');

  const user = await selectUser(userId);

  logger.trace(loggerContext, 'Successfully retrieved user');

  return user;
}
