import {
  afterAll,
  afterEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { PoolClient } from 'pg';
import {
  ingredients as IngredientsController,
  recipes,
} from '../../../../src/app/model/database/controllers';
import * as db from '../../../../src/app/model/database/db';
import * as RecipeQueries from '../../../../src/app/model/database/queries/recipes';
import {
  Recipe,
  RecipeIngredient,
  RecipeIngredientAmount,
} from '../../../../src/app/model/types';
import { getIngredientMap, getTestRecipe } from '../../../helpers';

describe('Database Controllers: Recipes', () => {
  const transactionSpy = jest
    .spyOn(db, 'transaction')
    .mockImplementation(async (cb) => {
      await cb({} as PoolClient);
      return Promise.resolve();
    });

  const selectRecipeSpy = jest.spyOn(RecipeQueries, 'selectRecipe');

  afterEach(() => {
    transactionSpy.mockClear();
    selectRecipeSpy.mockClear();
  });

  afterAll(() => {
    transactionSpy.mockRestore();
    selectRecipeSpy.mockRestore();
  });

  describe('nameExists', () => {
    test('returns true when query returns a recipe', async () => {
      selectRecipeSpy.mockResolvedValue(getTestRecipe());

      const exists = await recipes.nameExists('Butter Pecan');
      expect(exists).toBe(true);
      expect(selectRecipeSpy).toHaveBeenCalledWith('Butter Pecan');
    });

    test('returns true when query returns undefined', async () => {
      selectRecipeSpy.mockResolvedValue(undefined);

      const exists = await recipes.nameExists('Concrete');
      expect(exists).toBe(false);
      expect(selectRecipeSpy).toHaveBeenCalledWith('Concrete');
    });
  });

  describe('create', () => {
    const insertRecipeSpy = jest
      .spyOn(RecipeQueries, 'insertRecipe')
      .mockResolvedValue();

    const insertRecipeIngredientSpy = jest
      .spyOn(RecipeQueries, 'insertRecipeIngredient')
      .mockResolvedValue();

    afterEach(() => {
      insertRecipeSpy.mockClear();
      insertRecipeIngredientSpy.mockClear();
    });

    afterAll(() => {
      insertRecipeSpy.mockRestore();
      insertRecipeIngredientSpy.mockRestore();
    });

    test('invokes queries with recipe and recipe ingredients', async () => {
      const recipe = getTestRecipe();
      await recipes.create(recipe);

      expect(insertRecipeSpy).toHaveBeenCalledWith(recipe, {});
      expect(insertRecipeIngredientSpy).toHaveBeenCalledTimes(
        recipe.ingredients.length,
      );

      for (let i = 0; i < recipe.ingredients.length; i++) {
        expect(insertRecipeIngredientSpy).toHaveBeenNthCalledWith(
          i + 1,
          recipe.id,
          recipe.ingredients[i],
          {},
        );
      }
    });
  });

  describe('list', () => {
    const selectAllRecipesSpy = jest.spyOn(RecipeQueries, 'selectAllRecipes');

    afterEach(() => {
      selectAllRecipesSpy.mockClear();
    });

    afterAll(() => {
      selectAllRecipesSpy.mockRestore();
    });

    test('returns list of recipes wrapped in an object', async () => {
      const recipeList = [getTestRecipe()];
      selectAllRecipesSpy.mockResolvedValue(recipeList);

      const recipeCollection = await recipes.list();
      expect(selectAllRecipesSpy).toHaveBeenCalled();
      expect(recipeCollection.recipes).toEqual(recipeList);
    });

    test('returns empty list wrapped in object when query returns no results', async () => {
      selectAllRecipesSpy.mockResolvedValue([]);

      const recipeCollection = await recipes.list();
      expect(selectAllRecipesSpy).toHaveBeenCalled();
      expect(recipeCollection.recipes).toEqual([]);
    });
  });

  describe('get', () => {
    const getAsMapSpy = jest.spyOn(IngredientsController, 'getAsMap');
    const selectRecipeIngredientsSpy = jest.spyOn(
      RecipeQueries,
      'selectRecipeIngredients',
    );

    afterEach(() => {
      getAsMapSpy.mockClear();
      selectRecipeIngredientsSpy.mockClear();
    });

    afterAll(() => {
      getAsMapSpy.mockRestore();
      selectRecipeIngredientsSpy.mockRestore();
    });

    test('returns complete recipe object', async () => {
      const savedRecipe = getTestRecipe();
      selectRecipeSpy.mockResolvedValue(stripRecipeIngredients(savedRecipe));
      selectRecipeIngredientsSpy.mockResolvedValue(
        savedRecipe.ingredients.map((i) => toAmount(i)),
      );
      getAsMapSpy.mockResolvedValue(getIngredientMap(savedRecipe));

      const recipe = await recipes.get(savedRecipe.canonicalName);
      expect(selectRecipeSpy).toHaveBeenCalledWith(
        savedRecipe.canonicalName,
        {},
      );
      expect(recipe).toEqual(savedRecipe);
      expect(selectRecipeIngredientsSpy).toHaveBeenCalledWith(
        savedRecipe.id,
        {},
      );
      expect(getAsMapSpy).toHaveBeenCalledWith(
        savedRecipe.ingredients.map(({ ingredientId }) => ingredientId),
      );
      expect(transactionSpy).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});

export function stripRecipeIngredients(recipe: Recipe): Recipe {
  return {
    ...recipe,
    ingredients: [],
  };
}

export function toAmount(ing: RecipeIngredient): RecipeIngredientAmount {
  const { ingredientId, quantity, unit } = ing;
  return { ingredientId, quantity, unit };
}
