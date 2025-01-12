import { RecipeIngredientSummary } from '../../types';

export const PrepIngredientTableName = 'preparation_ingredients';

export interface PrepIngredientTable {
  ingredient_id: string;
  name: string;
  quantity: number;
  unit?: string;
}

export function tableToPrepIngredient(
  ipt: PrepIngredientTable,
): RecipeIngredientSummary {
  const { name, quantity, unit } = ipt;
  return { name, quantity, unit };
}
