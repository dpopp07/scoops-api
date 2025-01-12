import type { JSONSchemaType } from 'ajv';
import { UserPrototype } from '../types';

export const userPrototypeSchema: JSONSchemaType<UserPrototype> = {
  type: 'object',
  required: ['name', 'isAdmin'],
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-z]+$',
      minLength: 1,
      maxLength: 20,
    },
    isAdmin: {
      type: 'boolean',
    },
  },
};
