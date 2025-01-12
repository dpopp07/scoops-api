import {
  afterAll,
  afterEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { users } from '../../../../src/app/model/database/controllers';
import * as UserQueries from '../../../../src/app/model/database/queries/users';
import { getUserWithToken } from '../../../helpers';

describe('Database Controllers: Users', () => {
  describe('create', () => {
    const insertUserSpy = jest
      .spyOn(UserQueries, 'insertUser')
      .mockResolvedValue();

    afterEach(() => {
      insertUserSpy.mockClear();
    });

    afterAll(() => {
      insertUserSpy.mockRestore();
    });

    test('invokes queriy to store a user', async () => {
      const user = getUserWithToken();
      await users.create(user);

      expect(insertUserSpy).toHaveBeenCalledWith(user);
    });
  });

  describe('get', () => {
    const selectUserSpy = jest.spyOn(UserQueries, 'selectUser');

    afterEach(() => {
      selectUserSpy.mockClear();
    });

    afterAll(() => {
      selectUserSpy.mockRestore();
    });

    test('returns a user', async () => {
      const user = getUserWithToken();
      selectUserSpy.mockResolvedValue(user);

      const storedUser = await users.get('my-user-1234');
      expect(storedUser).toBe(user);
      expect(selectUserSpy).toHaveBeenCalledWith('my-user-1234');
    });

    test('returns undefined when no user is found', async () => {
      selectUserSpy.mockResolvedValue(undefined);

      const storedUser = await users.get('my-user-1234');
      expect(storedUser).toBeUndefined();
      expect(selectUserSpy).toHaveBeenCalledWith('my-user-1234');
    });
  });
});
