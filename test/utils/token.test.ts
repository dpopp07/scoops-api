import { afterAll, describe, expect, jest, test } from '@jest/globals';
import crypto from 'crypto';
import { Token } from '../../src/app/utils/token';

describe('token', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  const token = 'my-token';
  const storedHash =
    '2971ea0d0b103bb33a903e38434bb0206fdf292501735df7457da22dcd91ace71a64269eff4c2f6f47ecc2b6e8f6f55ae83c29f91ba4ab5396de7790bb6608aa';
  const salt = 'mockedrandombytesforthisunittest';

  test('hash', () => {
    jest.spyOn(crypto, 'randomBytes').mockImplementation(() => salt);
    expect(Token.hash(token)).toBe(`${storedHash}:${salt}`);
  });

  test('compare', () => {
    expect(Token.compare(`${storedHash}:${salt}`, token)).toBe(true);
    expect(Token.compare(`${storedHash}:${salt}`, 'wrong token')).toBe(false);
  });
});
