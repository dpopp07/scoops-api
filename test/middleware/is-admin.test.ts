import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { Request, Response } from 'express';
import { NotAuthorizedError } from '../../src/app/errors';
import { isAdmin } from '../../src/app/middleware';
import { getUser } from '../helpers';

describe('Middleware: isAdmin', () => {
  const mockRequest = {} as Request;
  const mockResponse = {} as unknown as Response;
  const mockNext = jest.fn();

  afterEach(() => {
    mockNext.mockClear();
  });

  test('admin privileges granted for admin user', () => {
    mockRequest.user = getUser();
    isAdmin(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test('rejects as unauthorized if user is not set on request', () => {
    mockRequest.user = undefined;
    expect(() => {
      isAdmin(mockRequest, mockResponse, mockNext);
    }).toThrow(NotAuthorizedError);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('rejects as unauthorized if user is not set on request', () => {
    mockRequest.user = {
      ...getUser(),
      isAdmin: false,
    };
    expect(() => {
      isAdmin(mockRequest, mockResponse, mockNext);
    }).toThrow(NotAuthorizedError);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
