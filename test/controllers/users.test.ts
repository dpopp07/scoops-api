import {
  afterAll,
  afterEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validate } from 'uuid';
import * as usersController from '../../src/app/controllers/users';
import { ValidationError } from '../../src/app/errors';
import { users as userStore } from '../../src/app/model/database/controllers';
import { User } from '../../src/app/model/types';
import { Token } from '../../src/app/utils/token';
import { getUserPrototype } from '../helpers';

describe('Controllers: Users', () => {
  const mockRequest = {} as Request;
  const mockResponse = {} as unknown as Response;

  const jsonMock = jest.fn(() => mockResponse);
  const statusMock = jest.fn(() => mockResponse);

  mockResponse.json = jsonMock;
  mockResponse.status = statusMock;

  const hashSpy = jest.spyOn(Token, 'hash');
  const signSpy = jest.spyOn(jwt, 'sign');
  const createSpy = jest.spyOn(userStore, 'create').mockResolvedValue();

  afterEach(() => {
    statusMock.mockClear();
    jsonMock.mockClear();
    hashSpy.mockClear();
    signSpy.mockClear();
    createSpy.mockClear();
  });

  afterAll(() => {
    hashSpy.mockRestore();
    signSpy.mockRestore();
    createSpy.mockRestore();
  });

  describe('register', () => {
    test('creates and stores new user', async () => {
      const token = 'my-jwt-token';
      const hash = 'my-hashed-token';
      signSpy.mockImplementation(() => token);
      hashSpy.mockImplementation(() => hash);

      const userPrototype = getUserPrototype();
      mockRequest.body = userPrototype;

      await usersController.register(mockRequest, mockResponse);

      expect(signSpy).toHaveBeenCalled();

      // TODO: ignore second argument until configuration injection is set up.
      const createdUserInfo = signSpy.mock.calls[0][0] as User;
      expect(createdUserInfo.name).toBe(userPrototype.name);
      expect(createdUserInfo.isAdmin).toBe(userPrototype.isAdmin);
      expect(validate(createdUserInfo.id)).toBe(true);

      expect(hashSpy).toHaveBeenCalledWith(token);

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createdUserInfo,
          token: hash,
        }),
      );

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createdUserInfo,
          token,
        }),
      );
    });

    test('throws error for invalid user object', async () => {
      // Missing required fields.
      mockRequest.body = {};

      await expect(
        usersController.register(mockRequest, mockResponse),
      ).rejects.toThrow(ValidationError);

      expect(signSpy).not.toHaveBeenCalled();
      expect(hashSpy).not.toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });
});
