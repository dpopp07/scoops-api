import type { DefinedError } from 'ajv';
import type { Request, Response } from 'express';
import { v7 as uuid } from 'uuid';
import { NotFoundError, RequestError, ValidationError } from '../errors';
import {
  ingredients as ingredientStore,
  recipes as recipeStore,
} from '../model/database/controllers';
import { validateRecipe } from '../model/schemas';
import type { Recipe, RecipeIngredient, RecipePrototype } from '../model/types';
import {
  analyze,
  cacheControlHeader,
  canonicalizeName,
  computeDateTime,
  getLogger,
  parseAjvErrors,
} from '../utils';

const logger = getLogger({
  layer: 'controller',
  resource: 'recipe',
});

export async function listRecipes(_req: Request, res: Response) {
  logger.info('Listing all recipes');
  const collection = await recipeStore.list();
  logger.info(
    { count: collection.recipes.length },
    'Responding with all retrieved recipes',
  );
  res.set(cacheControlHeader());
  res.status(200).json(collection);
}

export async function getRecipe(req: Request, res: Response) {
  const canonicalName: string = req.params.canonicalName;

  const loggerContext = {
    canonicalName,
  };

  logger.info(loggerContext, 'Retrieving recipe');

  const recipe = await recipeStore.get(canonicalName);

  if (!recipe) {
    logger.error(
      loggerContext,
      `No recipe found with canonical name matching given value: ${canonicalName}`,
    );

    throw new NotFoundError(
      `Not Found: there is no recipe matching the name ${canonicalName}`,
    );
  }

  logger.debug({ recipe }, 'Responding with retrieved recipe');

  res.set(cacheControlHeader());
  res.status(200).json(recipe);
}

export async function createRecipe(req: Request, res: Response) {
  const newRecipe: RecipePrototype = req.body;

  const loggerContext = {
    recipe: newRecipe,
  };

  logger.info(loggerContext, 'Creating new recipe');

  if (!validateRecipe(newRecipe)) {
    const validationMessage = `Invalid recipe: ${parseAjvErrors(validateRecipe.errors as DefinedError[])}`;
    logger.error(loggerContext, validationMessage);
    throw new ValidationError(validationMessage, 400);
  }

  // To be used as a human-readable, identifying "key" for the recipe.
  const canonicalName = canonicalizeName(newRecipe.name);

  const nameInUse = await recipeStore.nameExists(canonicalName);
  if (nameInUse) {
    logger.error(
      loggerContext,
      `Given recipe matches existing recipe: ${newRecipe.name}`,
    );
    throw new RequestError(
      `Bad Request: Ingredient already exists with name: ${newRecipe.name}`,
    );
  }

  logger.info(loggerContext, 'Retrieving ingredient information');

  // New recipes define ingredients by name - convert those names to IDs
  // to retrieve more details about the ingredients.
  const ingredientIds = await ingredientStore.getIds(
    newRecipe.ingredients.map(({ name }) => name),
  );

  const usedIngredients = await ingredientStore.getAsMap(ingredientIds);

  // Require all ingredients in the request are in the ingredients table.
  if (newRecipe.ingredients.length !== Object.keys(usedIngredients).length) {
    const missingIngredients = newRecipe.ingredients
      .reduce((arr, { name }) => {
        if (!usedIngredients[name]) {
          arr.push(name);
        }

        return arr;
      }, [] as string[])
      .join(', ');

    logger.error(
      loggerContext,
      `The following ingredient names are included in the request but do not exist: ${missingIngredients}`,
    );

    throw new NotFoundError(`Not Found: the ingredients ${missingIngredients}`);
  }

  // Calculate version for this name. The versioning feature is not yet implemented,
  // so the version is always 1.
  const version = 1;

  // Calculate analysis for this recipe
  logger.info(loggerContext, 'Analyzing recipe');
  const analysis = analyze(newRecipe.ingredients, usedIngredients);

  // Decorate the ingredients with additional information.
  const decoratedIngredients = newRecipe.ingredients.reduce((arr, i) => {
    const { id, preparation, category } = usedIngredients[i.name];
    arr.push({
      ...i,
      preparation,
      category,
      ingredientId: id,
    });

    return arr;
  }, [] as RecipeIngredient[]);

  const recipe: Recipe = {
    ...newRecipe,
    ingredients: decoratedIngredients,
    id: uuid(),
    canonicalName,
    version,
    analysis,
    createdAt: computeDateTime(),
  };

  await recipeStore.create(recipe);

  logger.info({ recipe }, 'Stored and responding with new recipe');
  res.status(201).json(recipe);
}
