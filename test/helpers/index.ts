import {
  IngredientMap,
  IngredientPrototype,
  Recipe,
  RecipeIngredient,
  RecipeIngredientSummary,
  RecipePrototype,
  User,
  UserPrototype,
  UserWithToken,
} from '../../src/app/model/types';
import { canonicalizeName } from '../../src/app/utils';
import {
  ingredients as ingredientData,
  recipes as recipeData,
} from '../test-data';

export function getUserPrototype(): UserPrototype {
  return {
    name: 'georgelucas',
    isAdmin: true,
  };
}

export function getUser(): User {
  return {
    ...getUserPrototype(),
    id: 'my-user-1234',
    createdAt: '2025-03-16T03:06:22.133Z',
  };
}

export function getUserWithToken(): UserWithToken {
  return {
    ...getUser(),
    token: 'abcd-1234',
  };
}

export function getTestRecipe(): Recipe {
  const recipePrototype = getTestRecipePrototype();
  return {
    ...recipePrototype,
    id: 'my-recipe-1234',
    createdAt: '2025-03-16T03:06:22.133Z',
    canonicalName: canonicalizeName(recipePrototype.name),
    version: 1,
    analysis: {
      totalFat: 1,
      milkFat: 1,
      totalSolids: 1,
      totalSolidsNonfat: 1,
      milkSolidsNonfat: 1,
      water: 1,
      sugars: 1,
      totalMass: 1,
      stabilizers: 1,
      pod: 1,
      pac: 1,
    },
    ingredients: decorateIngredients(recipePrototype.ingredients),
  };
}

export function getTestRecipePrototype(): RecipePrototype {
  return recipeData.butterPecan;
}

export function decorateIngredients(
  ingredients: RecipeIngredientSummary[],
): RecipeIngredient[] {
  return ingredients.map((ingredient, i) => {
    const { preparation, category } = findIngredientByName(ingredient.name);

    return {
      ...ingredient,
      preparation,
      category,
      ingredientId: mockIngredientId(i),
    };
  });
}

export function getIngredientMap(recipe: RecipePrototype): IngredientMap {
  return recipe.ingredients.reduce((map, { name }, idx) => {
    return {
      ...map,
      [name]: {
        id: mockIngredientId(idx),
        createdAt: '2025-03-16T03:06:22.133Z',
        ...findIngredientByName(name),
      },
    };
  }, {} as IngredientMap);
}

function mockIngredientId(i: number): string {
  return `ingredient-${i}`;
}

function findIngredientByName(ingredientName: string): IngredientPrototype {
  // This logic is for convenience - it will always find what it's looking for.
  return Object.values(ingredientData).find(
    ({ name }) => name === ingredientName,
  )!;
}
