import type { DefinedError } from 'ajv';
import type { Request, Response } from 'express';
import { v7 as uuid } from 'uuid';
import { RequestError, ValidationError } from '../errors';
import { ingredients as ingredientStore } from '../model/database/controllers';
import { validateIngredient } from '../model/schemas';
import type { Ingredient, IngredientPrototype } from '../model/types';
import { getLogger, parseAjvErrors } from '../utils';

const logger = getLogger({
  layer: 'controller',
  resource: 'ingredient',
});

export async function createIngredient(req: Request, res: Response) {
  const newIngredient: IngredientPrototype = req.body;
  const loggerContext = {
    ingredient: newIngredient,
  };

  logger.info(loggerContext, 'Creating new ingredient');

  if (!validateIngredient(newIngredient)) {
    const validationMessage = `Invalid ingredient: ${parseAjvErrors(validateIngredient.errors as DefinedError[])}`;
    logger.error(loggerContext, validationMessage);
    throw new ValidationError(validationMessage, 400);
  }

  const nameInUse = await ingredientStore.nameExists(newIngredient.name);
  if (nameInUse) {
    logger.error(
      loggerContext,
      `Given ingredient matches existing ingredient: ${newIngredient.name}`,
    );
    throw new RequestError(
      `Bad Request: Ingredient already exists with name: ${newIngredient.name}`,
    );
  }

  const ingredient: Ingredient = {
    ...newIngredient,
    id: uuid(),
  };

  await ingredientStore.create(ingredient);

  logger.info({ ingredient }, 'Stored and responding with new ingredient');
  res.status(201).json(ingredient);
}
