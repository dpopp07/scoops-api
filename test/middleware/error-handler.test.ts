import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { Request, Response } from 'express';
import { InternalError, NotFoundError } from '../../src/app/errors';
import { errorHandler } from '../../src/app/middleware';

describe('Middleware: errorHandler', () => {
  const mockRequest = {} as Request;
  const mockResponse = {} as unknown as Response;
  const mockNext = jest.fn();

  const jsonMock = jest.fn(() => mockResponse);
  const statusMock = jest.fn(() => mockResponse);

  mockResponse.json = jsonMock;
  mockResponse.status = statusMock;

  afterEach(() => {
    statusMock.mockClear();
    jsonMock.mockClear();
  });

  test('responds with internal error when error type is not recognized', () => {
    errorHandler(new Error(), mockRequest, mockResponse, mockNext);

    const internalError = new InternalError();

    expect(statusMock).toHaveBeenCalledWith(internalError.getStatusCode());
    expect(jsonMock).toHaveBeenCalledWith(internalError.asModel());
  });

  test('responds with custom error when recognized', () => {
    const notFoundError = new NotFoundError();
    errorHandler(notFoundError, mockRequest, mockResponse, mockNext);

    expect(statusMock).toHaveBeenCalledWith(notFoundError.getStatusCode());
    expect(jsonMock).toHaveBeenCalledWith(notFoundError.asModel());
  });
});
