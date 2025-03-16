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
import * as ingredientsController from '../../src/app/controllers/ingredients';
import { RequestError, ValidationError } from '../../src/app/errors';
import { ingredients as ingredientStore } from '../../src/app/model/database/controllers';
import { IngredientPrototype } from '../../src/app/model/types';
import { ingredients as ingredientData } from '../test-data';

describe('Controllers: Ingredients', () => {
  const mockRequest = {} as Request;
  const mockResponse = {} as unknown as Response;

  const jsonMock = jest.fn(() => mockResponse);
  const statusMock = jest.fn(() => mockResponse);

  mockResponse.json = jsonMock;
  mockResponse.status = statusMock;

  const createSpy = jest.spyOn(ingredientStore, 'create').mockResolvedValue();
  const nameExistsSpy = jest.spyOn(ingredientStore, 'nameExists');

  afterEach(() => {
    statusMock.mockClear();
    jsonMock.mockClear();
    nameExistsSpy.mockClear();
    createSpy.mockClear();
  });

  afterAll(() => {
    nameExistsSpy.mockRestore();
    createSpy.mockRestore();
  });

  describe('createIngredient', () => {
    test('creates and stores new ingredient', async () => {
      nameExistsSpy.mockResolvedValue(false);

      const ingredientPrototype = getIngredientPrototype();
      mockRequest.body = ingredientPrototype;

      await ingredientsController.createIngredient(mockRequest, mockResponse);

      expect(nameExistsSpy).toHaveBeenCalledWith(ingredientPrototype.name);

      expect(createSpy).toHaveBeenCalledWith({
        ...ingredientPrototype,
        id: expect.any(String),
        createdAt: expect.any(String),
      });

      const createdIngredient = createSpy.mock.calls[0][0];

      expect(validate(createdIngredient.id)).toBe(true);
      expect(new Date(createdIngredient.createdAt)).toBeInstanceOf(Date);
      expect(new Date(createdIngredient.createdAt).getTime()).not.toBeNaN();

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(createdIngredient);
    });

    test('throws error for invalid ingredient object', async () => {
      // Missing required fields.
      mockRequest.body = {};

      await expect(
        ingredientsController.createIngredient(mockRequest, mockResponse),
      ).rejects.toThrow(ValidationError);

      expect(nameExistsSpy).not.toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    test('throws error if ingredient name already exists', async () => {
      nameExistsSpy.mockResolvedValue(true);

      const ingredientPrototype = getIngredientPrototype();
      mockRequest.body = ingredientPrototype;

      await expect(
        ingredientsController.createIngredient(mockRequest, mockResponse),
      ).rejects.toThrow(RequestError);

      expect(nameExistsSpy).toHaveBeenCalledWith(ingredientPrototype.name);

      expect(createSpy).not.toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });
});

function getIngredientPrototype(): IngredientPrototype {
  return ingredientData.stabilizerBlend;
}
