import { describe, expect, test } from '@jest/globals';
import { Request, Response } from 'express';
import { NotFoundError } from '../../src/app/errors';
import { routeNotFound } from '../../src/app/middleware';

describe('Middleware: routeNotFound', () => {
  test('throws a NotFoundError object', () => {
    expect(() =>
      routeNotFound(
        {} as unknown as Request,
        {} as unknown as Response,
        () => {},
      ),
    ).toThrowError(NotFoundError);
  });
});
