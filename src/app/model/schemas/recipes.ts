import type { JSONSchemaType } from 'ajv';
import { RecipePrototype } from '../types';
import * as constraints from './constraints';

export const recipePrototypeSchema: JSONSchemaType<RecipePrototype> = {
  type: 'object',
  required: [
    'name',
    'subtitle',
    'description',
    'instructions',
    'estimatedMass',
    'base',
    'ingredients',
  ],
  properties: {
    name: {
      type: 'string',
      ...constraints.name,
    },
    subtitle: {
      type: 'string',
      minLength: 3,
      maxLength: 64,
    },
    description: {
      type: 'string',
      ...constraints.description,
    },
    instructions: {
      type: 'array',
      ...constraints.instructionsList,
      items: {
        type: 'string',
        ...constraints.instruction,
      },
    },
    estimatedMass: {
      type: 'integer',
      minimum: 800,
      maximum: 1000,
    },
    base: {
      type: 'string',
      ...constraints.name,
    },
    ingredients: {
      type: 'array',
      ...constraints.ingredientList,
      items: {
        type: 'object',
        required: ['name', 'quantity'],
        properties: {
          name: {
            type: 'string',
          },
          quantity: {
            type: 'number',
            ...constraints.quantity,
          },
          unit: {
            type: 'string',
            nullable: true,
            ...constraints.unit,
          },
        },
      },
    },
  },
};
