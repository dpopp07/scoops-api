import { RecipeIngredientAmount } from '../../types';

export const RecipeIngredientTableName = 'recipe_ingredients';

export interface RecipeIngredientTable {
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit?: string;
}

export function tableToRecipeIngredientAmount(
  ri: RecipeIngredientTable,
): RecipeIngredientAmount {
  const { quantity, unit, ingredient_id } = ri;

  return {
    ingredientId: ingredient_id,
    quantity,
    unit,
  };
}
