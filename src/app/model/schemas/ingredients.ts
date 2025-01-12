import type { JSONSchemaType } from 'ajv';
import { IngredientCategory, IngredientPrototype } from '../types';
import * as constraints from './constraints';

export const ingredientPrototypeSchema: JSONSchemaType<IngredientPrototype> = {
  type: 'object',
  required: ['name', 'description', 'category'],
  properties: {
    name: {
      type: 'string',
      ...constraints.name,
    },
    description: {
      type: 'string',
      ...constraints.description,
    },
    category: {
      type: 'string',
      enum: Object.values(IngredientCategory) as readonly IngredientCategory[],
    },
    data: {
      type: 'object',
      nullable: true,
      properties: {
        pod: {
          type: 'number',
          nullable: true,
          minimum: -2.0,
          maximum: 2.0,
        },
        pac: {
          type: 'number',
          nullable: true,
          minimum: -5.0,
          maximum: 5.0,
        },
        milkFat: {
          type: 'number',
          nullable: true,
          ...constraints.ratio,
        },
        otherFat: {
          type: 'number',
          nullable: true,
          ...constraints.ratio,
        },
        milkSolidsNonfat: {
          type: 'number',
          nullable: true,
          ...constraints.ratio,
        },
        otherSolidsNonfat: {
          type: 'number',
          nullable: true,
          ...constraints.ratio,
        },
        water: {
          type: 'number',
          nullable: true,
          ...constraints.ratio,
        },
        sugars: {
          type: 'number',
          nullable: true,
          ...constraints.ratio,
        },
        stabilizers: {
          type: 'number',
          nullable: true,
          ...constraints.ratio,
        },
      },
    },
    preparation: {
      type: 'object',
      nullable: true,
      required: ['description', 'ingredients', 'instructions'],
      properties: {
        description: {
          type: 'string',
          ...constraints.description,
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
        instructions: {
          type: 'array',
          ...constraints.instructionsList,
          items: {
            type: 'string',
            ...constraints.instruction,
          },
        },
      },
    },
  },
};
