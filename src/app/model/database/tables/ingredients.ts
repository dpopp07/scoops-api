import { Ingredient, IngredientCategory } from '../../types';

export const IngredientTableName = 'ingredients';

export interface IngredientTable {
  id: string;
  name: string;
  description: string;
  category: IngredientCategory;
  pod?: number;
  pac?: number;
  milk_fat?: number;
  other_fat?: number;
  milk_solids_nonfat?: number;
  other_solids_nonfat?: number;
  water?: number;
  sugars?: number;
  stabilizers?: number;
  preparation_instructions?: string[];
  preparation_description?: string;
}

export function tableToIngredient(table: IngredientTable): Ingredient {
  const {
    id,
    name,
    description,
    category,
    pod,
    pac,
    milk_fat,
    other_fat,
    milk_solids_nonfat,
    other_solids_nonfat,
    water,
    sugars,
    stabilizers,
    preparation_instructions,
    preparation_description,
  } = table;

  const ingredient: Ingredient = {
    id,
    name,
    description,
    category,
  };

  const optionalData = Object.entries({
    pod,
    pac,
    milkFat: milk_fat,
    otherFat: other_fat,
    milkSolidsNonfat: milk_solids_nonfat,
    otherSolidsNonfat: other_solids_nonfat,
    water,
    sugars,
    stabilizers,
  }).filter(([_, val]) => val !== undefined);

  if (optionalData.length) {
    ingredient.data = Object.fromEntries(optionalData);
  }

  if (preparation_instructions?.length && preparation_description) {
    ingredient.preparation = {
      instructions: preparation_instructions,
      description: preparation_description,
      ingredients: [],
    };
  }

  return ingredient;
}
