import { getLogger } from '../../../utils';
import {
  Ingredient,
  IngredientMap,
  RecipeIngredientSummary,
} from '../../types';
import { transaction } from '../db';
import {
  insertIngredient,
  insertPrepIngredient,
  selectIngredient,
  selectIngredientIds,
  selectIngredients,
  selectPrepIngredients,
} from '../queries/ingredients';

const logger = getLogger({
  layer: 'data',
  resource: 'ingredient',
});

export async function nameExists(name: string) {
  const loggerContext = {
    name,
  };

  logger.trace(
    loggerContext,
    'Checking database for the existance of ingredient with this name',
  );

  const ingredient = await selectIngredient(name);
  if (!ingredient) {
    logger.trace(
      loggerContext,
      'No ingredient found with this name in database',
    );
    return false;
  }

  logger.trace(loggerContext, 'Ingredient with this name found in database');
  return true;
}

export async function create(ingredient: Ingredient) {
  const loggerContext = {
    ingredient,
  };

  const { id, preparation } = ingredient;

  logger.trace(loggerContext, 'Beginning transaction to store new ingredient');

  await transaction(async (client) => {
    if (preparation) {
      // TODO: At some point, update insertion to handle multiple rows at once.
      // For now, creation happens so infrequently that optimization is unnecessary.
      for (const prepIngredient of preparation.ingredients) {
        await insertPrepIngredient(id, prepIngredient, client);
      }
    }

    await insertIngredient(ingredient, client);
  });

  logger.trace(loggerContext, 'Successfully stored ingredient');
}

export async function getAsMap(ids: string[]) {
  const loggerContext = {
    ids,
  };

  let ingredients: Ingredient[] = [];
  let preps: Record<string, RecipeIngredientSummary[]> = {};

  logger.trace(loggerContext, 'Beginning transaction to retrieve ingredients');

  await transaction(async (client) => {
    ingredients = await selectIngredients(ids, client);
    preps = await selectPrepIngredients(ids, client);
  });

  logger.trace(
    loggerContext,
    `Returning ${ingredients.length} ingredients as a map`,
  );

  return ingredients.reduce((map, ingredient) => {
    if (ingredient.preparation && preps[ingredient.id]) {
      ingredient.preparation.ingredients = preps[ingredient.id];
    }

    map[ingredient.name] = ingredient;

    return map;
  }, {} as IngredientMap);
}

export async function getIds(names: string[]) {
  const loggerContext = {
    names,
  };

  logger.trace(
    loggerContext,
    'Beginning transaction to retrieve ingredient IDs',
  );

  const idRows = await selectIngredientIds(names);
  const ids = idRows.map(({ id }) => id);

  logger.trace(
    loggerContext,
    `Retrieved the following ingredient IDs: '${ids.join(',')}'`,
  );

  return ids;
}
