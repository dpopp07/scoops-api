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
import { NotAuthorizedError } from '../../src/app/errors';
import { authenticate } from '../../src/app/middleware';
import { users as userStore } from '../../src/app/model/database/controllers';
import { Token } from '../../src/app/utils/token';
import { getUser, getUserWithToken } from '../helpers';

describe('Middleware: authenticate', () => {
  const headerGetMock = jest.fn();
  const mockRequest = {
    get: headerGetMock,
  } as unknown as Request;

  const mockResponse = {} as unknown as Response;

  const jsonMock = jest.fn(() => mockResponse);
  const statusMock = jest.fn(() => mockResponse);

  mockResponse.json = jsonMock;
  mockResponse.status = statusMock;

  const mockNext = jest.fn();

  const compareSpy = jest.spyOn(Token, 'compare');
  const verifySpy = jest.spyOn(jwt, 'verify');
  const getSpy = jest.spyOn(userStore, 'get');

  afterEach(() => {
    mockNext.mockClear();
    statusMock.mockClear();
    jsonMock.mockClear();
    headerGetMock.mockClear();
    compareSpy.mockClear();
    verifySpy.mockClear();
    getSpy.mockClear();

    mockRequest.user = undefined;
  });

  afterAll(() => {
    compareSpy.mockRestore();
    verifySpy.mockRestore();
    getSpy.mockRestore();
  });

  test('successfully authenticates user', async () => {
    const user = getUser();
    const storedUser = getUserWithToken();
    const token = 'my-token-123';

    headerGetMock.mockImplementation(() => `Bearer ${token}`);
    verifySpy.mockImplementation(() => user);
    getSpy.mockResolvedValue(storedUser);
    compareSpy.mockReturnValue(true);

    await authenticate(mockRequest, mockResponse, mockNext);

    expect(headerGetMock).toHaveBeenCalledWith('authorization');
    expect(verifySpy).toHaveBeenCalledWith(token, expect.any(String));
    expect(getSpy).toHaveBeenCalledWith(user.id);
    expect(compareSpy).toHaveBeenCalledWith(storedUser.token, token);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toEqual(user);
  });

  test('rejects as unauthorized if auth header is missing', async () => {
    headerGetMock.mockImplementation(() => undefined);
    await expect(
      authenticate(mockRequest, mockResponse, mockNext),
    ).rejects.toThrow(NotAuthorizedError);

    expect(headerGetMock).toHaveBeenCalledWith('authorization');
    expect(verifySpy).not.toHaveBeenCalled();
    expect(getSpy).not.toHaveBeenCalled();
    expect(compareSpy).not.toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  test('rejects as unauthorized if auth header is missing', async () => {
    headerGetMock.mockImplementation(() => 'Cool Token: my-token-123');

    await expect(
      authenticate(mockRequest, mockResponse, mockNext),
    ).rejects.toThrow(NotAuthorizedError);

    expect(headerGetMock).toHaveBeenCalledWith('authorization');
    expect(verifySpy).not.toHaveBeenCalled();
    expect(getSpy).not.toHaveBeenCalled();
    expect(compareSpy).not.toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  test('rejects as unauthorized if jwt is unverified', async () => {
    const token = 'my-token-123';
    headerGetMock.mockImplementation(() => `Bearer ${token}`);

    verifySpy.mockImplementation(() => {
      throw new Error();
    });

    await expect(
      authenticate(mockRequest, mockResponse, mockNext),
    ).rejects.toThrow(NotAuthorizedError);

    expect(headerGetMock).toHaveBeenCalledWith('authorization');
    expect(verifySpy).toHaveBeenCalledWith(token, expect.any(String));
    expect(getSpy).not.toHaveBeenCalled();
    expect(compareSpy).not.toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  test('rejects as unauthorized if user is not found', async () => {
    const token = 'my-token-123';
    headerGetMock.mockImplementation(() => `Bearer ${token}`);

    const user = getUser();
    verifySpy.mockImplementation(() => user);

    getSpy.mockResolvedValue(undefined);

    await expect(
      authenticate(mockRequest, mockResponse, mockNext),
    ).rejects.toThrow(NotAuthorizedError);

    expect(headerGetMock).toHaveBeenCalledWith('authorization');
    expect(verifySpy).toHaveBeenCalledWith(token, expect.any(String));
    expect(getSpy).toHaveBeenCalledWith(user.id);
    expect(compareSpy).not.toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });

  test('rejects as unauthorized if token does not match stored user', async () => {
    const token = 'my-token-123';
    headerGetMock.mockImplementation(() => `Bearer ${token}`);

    const user = getUser();
    const storedUser = getUserWithToken();

    verifySpy.mockImplementation(() => user);
    getSpy.mockResolvedValue(storedUser);
    compareSpy.mockReturnValue(false);

    await expect(
      authenticate(mockRequest, mockResponse, mockNext),
    ).rejects.toThrow(NotAuthorizedError);

    expect(headerGetMock).toHaveBeenCalledWith('authorization');
    expect(verifySpy).toHaveBeenCalledWith(token, expect.any(String));
    expect(getSpy).toHaveBeenCalledWith(user.id);
    expect(compareSpy).toHaveBeenCalledWith(storedUser.token, token);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRequest.user).toBeUndefined();
  });
});
