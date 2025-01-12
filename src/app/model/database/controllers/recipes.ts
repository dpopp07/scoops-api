import { getLogger } from '../../../utils';
import { Recipe, RecipeCollection } from '../../types';
import { transaction } from '../db';
import {
  insertRecipe,
  insertRecipeIngredient,
  selectAllRecipes,
  selectRecipe,
  selectRecipeIngredients,
} from '../queries/recipes';
import { getAsMap } from './ingredients';

const logger = getLogger({
  layer: 'data',
  resource: 'recipe',
});

export async function nameExists(name: string) {
  const loggerContext = {
    name,
  };

  logger.trace(
    loggerContext,
    'Checking database for the existance of recipe with this name',
  );

  const recipe = await selectRecipe(name);
  if (!recipe) {
    logger.trace(loggerContext, 'No recipe found with this name in database');
    return false;
  }

  logger.trace(loggerContext, 'Recipe with this name found in database');
  return true;
}

export async function create(recipe: Recipe) {
  const loggerContext = {
    recipe,
  };

  const { id, ingredients } = recipe;

  logger.trace(loggerContext, 'Beginning transaction to store new recipe');
  await transaction(async (client) => {
    // First, store all necessary recipe ingredients.
    for (const ingredient of ingredients) {
      await insertRecipeIngredient(id, ingredient, client);
    }

    // Then, store the full recipe.
    await insertRecipe(recipe, client);
  });

  logger.trace(loggerContext, 'Successfully stored recipe in the database');
}

export async function list(): Promise<RecipeCollection> {
  logger.trace('Retrieving all recipes from the database');

  const recipes = await selectAllRecipes();

  logger.trace('Successfully retrieved all recipes from the database');
  return { recipes };
}

export async function get(canonicalName: string): Promise<Recipe | undefined> {
  const loggerContext = {
    canonicalName,
  };

  logger.trace(loggerContext, 'Retrieving recipe from the database');

  let recipe = {} as Recipe | undefined;

  await transaction(async (client) => {
    recipe = await selectRecipe(canonicalName, client);

    if (recipe) {
      logger.trace(loggerContext, 'Found recipe in the database');

      const { id } = recipe;
      const recipeIngredients = await selectRecipeIngredients(id, client);

      const ingredientMap = await getAsMap(
        recipeIngredients.map(({ ingredientId }) => ingredientId),
      );

      for (const recipeIngredient of recipeIngredients) {
        const ingredient = Object.values(ingredientMap).find(
          ({ id }) => id === recipeIngredient.ingredientId,
        );

        if (ingredient) {
          recipe.ingredients.push({
            ...recipeIngredient,
            name: ingredient.name,
            preparation: ingredient.preparation,
            category: ingredient.category,
          });
        }
      }
    }
  });

  if (!recipe) {
    logger.trace(loggerContext, 'Could not find recipe in the database');
  } else {
    logger.trace(loggerContext, 'Returning recipe from the database');
  }

  return recipe;
}
