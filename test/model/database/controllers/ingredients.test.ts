import {
  afterAll,
  afterEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { PoolClient } from 'pg';
import { ingredients } from '../../../../src/app/model/database/controllers';
import * as db from '../../../../src/app/model/database/db';
import * as IngredientQueries from '../../../../src/app/model/database/queries/ingredients';
import {
  Ingredient,
  RecipeIngredientSummary,
} from '../../../../src/app/model/types';
import { ingredients as ingredientData } from '../../../test-data';

describe('Database Controllers: Ingredients', () => {
  const transactionSpy = jest
    .spyOn(db, 'transaction')
    .mockImplementation(async (cb) => {
      await cb({} as PoolClient);
      return Promise.resolve();
    });

  afterEach(() => {
    transactionSpy.mockClear();
  });

  afterAll(() => {
    transactionSpy.mockRestore();
  });

  describe('nameExists', () => {
    const selectIngredientSpy = jest.spyOn(
      IngredientQueries,
      'selectIngredient',
    );

    afterEach(() => {
      selectIngredientSpy.mockClear();
    });

    afterAll(() => {
      selectIngredientSpy.mockRestore();
    });

    test('returns true when query returns an ingredient', async () => {
      selectIngredientSpy.mockResolvedValue(getIngredient());

      const exists = await ingredients.nameExists('Toasted Milk Powder');
      expect(exists).toBe(true);
      expect(selectIngredientSpy).toHaveBeenCalledWith('Toasted Milk Powder');
    });

    test('returns true when query returns undefined', async () => {
      selectIngredientSpy.mockResolvedValue(undefined);

      const exists = await ingredients.nameExists('Concrete');
      expect(exists).toBe(false);
      expect(selectIngredientSpy).toHaveBeenCalledWith('Concrete');
    });
  });

  describe('create', () => {
    const insertIngredientSpy = jest
      .spyOn(IngredientQueries, 'insertIngredient')
      .mockResolvedValue();

    const insertPrepIngredientSpy = jest
      .spyOn(IngredientQueries, 'insertPrepIngredient')
      .mockResolvedValue();

    afterEach(() => {
      insertIngredientSpy.mockClear();
      insertPrepIngredientSpy.mockClear();
    });

    afterAll(() => {
      insertIngredientSpy.mockRestore();
      insertPrepIngredientSpy.mockRestore();
    });

    test('invokes queries with ingredients and preparation ingredients', async () => {
      const ingredient = getIngredient();
      await ingredients.create(ingredient);

      // This is where preparation is confirmed to be defined,
      // which is assumed downstream.
      expect(ingredient.preparation).toBeDefined();
      expect(insertIngredientSpy).toHaveBeenCalledWith(ingredient, {});
      expect(insertPrepIngredientSpy).toHaveBeenCalledTimes(
        ingredient.preparation!.ingredients.length,
      );

      for (let i = 0; i < ingredient.preparation!.ingredients.length; i++) {
        expect(insertPrepIngredientSpy).toHaveBeenNthCalledWith(
          i + 1,
          ingredient.id,
          ingredient.preparation!.ingredients[i],
          {},
        );
      }
    });

    test('does not invoke preparation ingredient query if no preparation', async () => {
      const ingredient = getIngredientWithoutPrep();
      await ingredients.create(ingredient);

      expect(ingredient.preparation).not.toBeDefined();
      expect(insertIngredientSpy).toHaveBeenCalledWith(ingredient, {});
      expect(insertPrepIngredientSpy).not.toHaveBeenCalled();
    });
  });

  describe('getAsMap', () => {
    const selectIngredientsSpy = jest.spyOn(
      IngredientQueries,
      'selectIngredients',
    );

    const selectPrepIngredientsSpy = jest.spyOn(
      IngredientQueries,
      'selectPrepIngredients',
    );

    afterEach(() => {
      selectIngredientsSpy.mockClear();
      selectPrepIngredientsSpy.mockClear();
    });

    afterAll(() => {
      selectIngredientsSpy.mockRestore();
      selectPrepIngredientsSpy.mockRestore();
    });

    test('gets multiple ingredients as a map', async () => {
      const testIngredients = [getIngredient(), getIngredientWithoutPrep()];
      selectIngredientsSpy.mockResolvedValue(
        testIngredients.map((i) => stripPrepIngredients(i)),
      );

      selectPrepIngredientsSpy.mockResolvedValue(
        getPrepIngredientMap(testIngredients),
      );

      const ids = ['my-ingredient-1234', 'my-prepless-ingredient-1234'];
      const asMap = await ingredients.getAsMap(ids);

      expect(asMap[testIngredients[0].name]).toEqual(getIngredient());
      expect(asMap[testIngredients[1].name]).toEqual(
        getIngredientWithoutPrep(),
      );
      expect(selectIngredientsSpy).toHaveBeenCalledWith(ids, {});
      expect(selectPrepIngredientsSpy).toHaveBeenCalledWith(ids, {});
    });

    test('gets one prepless ingredient as a map', async () => {
      const testIngredients = [getIngredientWithoutPrep()];
      selectIngredientsSpy.mockResolvedValue(
        testIngredients.map((i) => stripPrepIngredients(i)),
      );

      selectPrepIngredientsSpy.mockResolvedValue({});

      const ids = ['my-prepless-ingredient-1234'];
      const asMap = await ingredients.getAsMap(ids);

      expect(asMap[testIngredients[0].name]).toEqual(
        getIngredientWithoutPrep(),
      );
      expect(selectIngredientsSpy).toHaveBeenCalledWith(ids, {});
      expect(selectPrepIngredientsSpy).toHaveBeenCalledWith(ids, {});
    });
  });

  describe('getIds', () => {
    const selectIngredientIdsSpy = jest.spyOn(
      IngredientQueries,
      'selectIngredientIds',
    );

    afterEach(() => {
      selectIngredientIdsSpy.mockClear();
    });

    afterAll(() => {
      selectIngredientIdsSpy.mockRestore();
    });

    const names = ['luke', 'leia', 'han'];

    test('returns an id for every name', async () => {
      selectIngredientIdsSpy.mockResolvedValue([
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
      ]);

      const ids = await ingredients.getIds(names);
      expect(ids.length).toBe(names.length);
      expect(ids).toEqual(['a', 'b', 'c']);
      expect(selectIngredientIdsSpy).toHaveBeenCalledWith(names);
    });

    test('returns the ids found, even if there is not one for every name', async () => {
      selectIngredientIdsSpy.mockResolvedValue([{ id: 'a' }, { id: 'b' }]);

      const ids = await ingredients.getIds(names);
      expect(ids.length).toBe(2);
      expect(ids).toEqual(['a', 'b']);
      expect(selectIngredientIdsSpy).toHaveBeenCalledWith(names);
    });

    test('returns an empty array when no ids are found', async () => {
      selectIngredientIdsSpy.mockResolvedValue([]);

      const ids = await ingredients.getIds(names);
      expect(ids.length).toBe(0);
      expect(selectIngredientIdsSpy).toHaveBeenCalledWith(names);
    });
  });
});

function getIngredient(): Ingredient {
  return {
    id: 'my-ingredient-1234',
    createdAt: '2025-03-16T03:06:22.133Z',
    ...ingredientData.toastedMilkPowder,
  };
}

function getIngredientWithoutPrep(): Ingredient {
  return {
    id: 'my-prepless-ingredient-1234',
    createdAt: '2025-03-16T03:06:22.133Z',
    ...ingredientData.dextrose,
  };
}

function stripPrepIngredients(ingredient: Ingredient): Ingredient {
  if (ingredient.preparation) {
    ingredient.preparation.ingredients = [];
  }

  return ingredient;
}

function getPrepIngredientMap(
  ingredientList: Ingredient[],
): Record<string, RecipeIngredientSummary[]> {
  return ingredientList.reduce(
    (map, { id, preparation }) => {
      if (preparation?.ingredients.length) {
        map[id] = preparation.ingredients;
      }

      return map;
    },
    {} as Record<string, RecipeIngredientSummary[]>,
  );
}
