import Ajv from 'ajv';

import { ingredientPrototypeSchema } from './ingredients';
import { recipePrototypeSchema } from './recipes';
import { userPrototypeSchema } from './users';

const ajv = new Ajv();

export const validateIngredient = ajv.compile(ingredientPrototypeSchema);
export const validateRecipe = ajv.compile(recipePrototypeSchema);
export const validateUser = ajv.compile(userPrototypeSchema);
