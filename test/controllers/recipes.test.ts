import {
  afterAll,
  afterEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { Request, Response } from 'express';
import { validate } from 'uuid';
import * as recipesController from '../../src/app/controllers/recipes';
import {
  NotFoundError,
  RequestError,
  ValidationError,
} from '../../src/app/errors';
import {
  ingredients as ingredientStore,
  recipes as recipeStore,
} from '../../src/app/model/database/controllers';
import { canonicalizeName } from '../../src/app/utils';
import {
  getIngredientMap,
  getTestRecipe,
  getTestRecipePrototype,
} from '../helpers';

describe('Controllers: Recipes', () => {
  const mockRequest = {} as Request;
  const mockResponse = {} as unknown as Response;

  const jsonMock = jest.fn(() => mockResponse);
  const statusMock = jest.fn(() => mockResponse);
  const setMock = jest.fn(() => mockResponse);

  mockResponse.json = jsonMock;
  mockResponse.status = statusMock;
  mockResponse.set = setMock;

  afterEach(() => {
    statusMock.mockClear();
    jsonMock.mockClear();
    setMock.mockClear();
  });

  describe('listRecipes', () => {
    const listSpy = jest.spyOn(recipeStore, 'list');

    afterEach(() => {
      listSpy.mockClear();
    });

    afterAll(() => {
      listSpy.mockRestore();
    });

    test('lists all stored recipes', async () => {
      const storedCollection = { recipes: [getTestRecipe()] };
      listSpy.mockResolvedValue(storedCollection);

      await recipesController.listRecipes(mockRequest, mockResponse);

      expect(listSpy).toHaveBeenCalled();

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(storedCollection);
      expect(setMock).toHaveBeenCalledWith(
        expect.objectContaining({
          'Cache-Control': expect.any(String),
        }),
      );
    });

    test('responds with empty collection if there are no recipes', async () => {
      const storedCollection = { recipes: [] };
      listSpy.mockResolvedValue(storedCollection);

      await recipesController.listRecipes(mockRequest, mockResponse);

      expect(listSpy).toHaveBeenCalled();

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(storedCollection);
      expect(setMock).toHaveBeenCalledWith(
        expect.objectContaining({
          'Cache-Control': expect.any(String),
        }),
      );
    });
  });

  describe('getRecipe', () => {
    const getSpy = jest.spyOn(recipeStore, 'get');

    afterEach(() => {
      getSpy.mockClear();
    });

    afterAll(() => {
      getSpy.mockRestore();
    });

    test('gets an existing recipe', async () => {
      const storedRecipe = getTestRecipe();
      getSpy.mockResolvedValue(storedRecipe);

      const canonicalName = canonicalizeName(storedRecipe.name);
      mockRequest.params = {
        canonicalName,
      };

      await recipesController.getRecipe(mockRequest, mockResponse);

      expect(getSpy).toHaveBeenCalledWith(canonicalName);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(storedRecipe);
      expect(setMock).toHaveBeenCalledWith(
        expect.objectContaining({
          'Cache-Control': expect.any(String),
        }),
      );
    });

    test('throws error if recipe does not exist', async () => {
      getSpy.mockResolvedValue(undefined);

      const canonicalName = 'death-sticks';
      mockRequest.params = {
        canonicalName,
      };

      await expect(
        recipesController.getRecipe(mockRequest, mockResponse),
      ).rejects.toThrow(NotFoundError);

      expect(getSpy).toHaveBeenCalledWith(canonicalName);

      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
      expect(setMock).not.toHaveBeenCalled();
    });
  });

  describe('createRecipe', () => {
    const getIngredientIdsSpy = jest
      .spyOn(ingredientStore, 'getIds')
      .mockImplementation(async (names) =>
        names.map((_, i) => `ingredient-${i}`),
      );

    const createSpy = jest.spyOn(recipeStore, 'create').mockResolvedValue();
    const nameExistsSpy = jest.spyOn(recipeStore, 'nameExists');
    const getIngredientsAsMapSpy = jest.spyOn(ingredientStore, 'getAsMap');

    afterEach(() => {
      getIngredientIdsSpy.mockClear();
      createSpy.mockClear();
      nameExistsSpy.mockClear();
      getIngredientsAsMapSpy.mockClear();
    });

    afterAll(() => {
      getIngredientIdsSpy.mockRestore();
      createSpy.mockRestore();
      nameExistsSpy.mockRestore();
      getIngredientsAsMapSpy.mockRestore();
    });

    test('creates and stores new recipe', async () => {
      nameExistsSpy.mockResolvedValue(false);

      const recipePrototype = getTestRecipePrototype();
      mockRequest.body = recipePrototype;

      getIngredientsAsMapSpy.mockResolvedValue(
        getIngredientMap(recipePrototype),
      );

      await recipesController.createRecipe(mockRequest, mockResponse);

      expect(nameExistsSpy).toHaveBeenCalledWith(
        canonicalizeName(recipePrototype.name),
      );

      expect(getIngredientIdsSpy).toHaveBeenCalledWith(
        recipePrototype.ingredients.map(({ name }) => name),
      );

      expect(getIngredientIdsSpy).toHaveReturnedTimes(1);

      expect(getIngredientsAsMapSpy).toHaveBeenCalledWith(
        await getIngredientIdsSpy.mock.results[0].value,
      );

      expect(createSpy).toHaveBeenCalledWith({
        ...recipePrototype,
        id: expect.any(String),
        canonicalName: canonicalizeName(recipePrototype.name),
        version: 1,
        analysis: expect.objectContaining({
          totalFat: expect.any(Number),
          milkFat: expect.any(Number),
          totalSolids: expect.any(Number),
          totalSolidsNonfat: expect.any(Number),
          milkSolidsNonfat: expect.any(Number),
          water: expect.any(Number),
          sugars: expect.any(Number),
          totalMass: expect.any(Number),
          pod: expect.any(Number),
          pac: expect.any(Number),
          stabilizers: expect.any(Number),
        }),
        ingredients: expect.any(Array),
      });

      const createdRecipe = createSpy.mock.calls[0][0];

      expect(validate(createdRecipe.id)).toBe(true);
      for (const i of createdRecipe.ingredients) {
        expect(i).toEqual(
          expect.objectContaining({
            quantity: expect.any(Number),
            name: expect.any(String),
            ingredientId: expect.any(String),
            category: expect.any(String),
          }),
        );

        if (i.unit) {
          expect(i.unit).toEqual(expect.any(String));
        }

        if (i.preparation) {
          expect(i.preparation).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              instructions: expect.any(Array),
              ingredients: expect.any(Array),
            }),
          );
        }
      }

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(createdRecipe);
    });

    test('throws error for invalid recipe object', async () => {
      // Missing required fields.
      mockRequest.body = {};

      await expect(
        recipesController.createRecipe(mockRequest, mockResponse),
      ).rejects.toThrow(ValidationError);

      expect(nameExistsSpy).not.toHaveBeenCalled();
      expect(getIngredientIdsSpy).not.toHaveBeenCalled();
      expect(getIngredientsAsMapSpy).not.toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    test('throws error if recipe name already exists', async () => {
      nameExistsSpy.mockResolvedValue(true);

      const recipePrototype = getTestRecipePrototype();
      mockRequest.body = recipePrototype;

      await expect(
        recipesController.createRecipe(mockRequest, mockResponse),
      ).rejects.toThrow(RequestError);

      expect(nameExistsSpy).toHaveBeenCalledWith(
        canonicalizeName(recipePrototype.name),
      );

      expect(getIngredientIdsSpy).not.toHaveBeenCalled();
      expect(getIngredientsAsMapSpy).not.toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    test('throws error if recipe includes ingredients that do not exist', async () => {
      nameExistsSpy.mockResolvedValue(false);
      getIngredientsAsMapSpy.mockResolvedValue({});

      const recipePrototype = getTestRecipePrototype();
      mockRequest.body = recipePrototype;

      await expect(
        recipesController.createRecipe(mockRequest, mockResponse),
      ).rejects.toThrow(NotFoundError);

      expect(nameExistsSpy).toHaveBeenCalledWith(
        canonicalizeName(recipePrototype.name),
      );

      expect(getIngredientIdsSpy).toHaveBeenCalled();
      expect(getIngredientsAsMapSpy).toHaveBeenCalled();

      expect(createSpy).not.toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });
});
