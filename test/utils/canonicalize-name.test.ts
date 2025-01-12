import { describe, expect, test } from '@jest/globals';
import { canonicalizeName } from '../../src/app/utils';

describe('canonicalize-name', () => {
  test('canonicalizes names', () => {
    expect(canonicalizeName('Vanilla')).toBe('vanilla');
    expect(canonicalizeName('Butter Pecan')).toBe('butter-pecan');
    expect(canonicalizeName('Cookies and Cream')).toBe('cookies-and-cream');
  });
});
