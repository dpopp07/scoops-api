import { describe, expect, test } from '@jest/globals';
import { DefinedError } from 'ajv';
import { parseAjvErrors } from '../../src/app/utils';

describe('parse-ajv-errors', () => {
  test('missing required top-level property', () => {
    const testData: DefinedError[] = [
      {
        instancePath: '',
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'category' },
        message: "must have required property 'category'",
      },
    ];

    expect(parseAjvErrors(testData)).toBe(
      "Resource must have required property 'category'",
    );
  });

  test('top-level property does not match pattern', () => {
    const testData: DefinedError[] = [
      {
        instancePath: '/name',
        schemaPath: '#/properties/name/pattern',
        keyword: 'pattern',
        params: { pattern: '^([A-Z][^A-Zs]* ?)+[^s]$' },
        message: 'must match pattern "^([A-Z][^A-Zs]* ?)+[^s]$"',
      },
    ];

    expect(parseAjvErrors(testData)).toBe(
      "Property 'name' must match pattern ^([A-Z][^A-Zs]* ?)+[^s]$",
    );
  });

  test('nested items property does not match pattern', () => {
    const testData: DefinedError[] = [
      {
        instancePath: '/instructions/2',
        schemaPath: '#/properties/instructions/items/pattern',
        keyword: 'pattern',
        params: { pattern: '^([A-Z][^A-Z]*[.!?] ?)+$' },
        message: 'must match pattern "^([A-Z][^A-Z]*[.!?] ?)+$"',
      },
    ];

    expect(parseAjvErrors(testData)).toBe(
      "Property 'instructions/2' must match pattern ^([A-Z][^A-Z]*[.!?] ?)+$",
    );
  });
});
