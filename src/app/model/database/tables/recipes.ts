import { Recipe, RecipeSummary } from '../../types';

export const RecipeTableName = 'recipes';

export interface RecipeTableSummary {
  id: string;
  name: string;
  canonical_name: string;
  subtitle: string;
  created_at: string;
}

export interface RecipeTable extends RecipeTableSummary {
  description: string;
  instructions: string[];
  base: string;
  estimated_mass: number;
  version: number;
  total_fat: number;
  milk_fat: number;
  total_solids: number;
  total_solids_nonfat: number;
  milk_solids_nonfat: number;
  water: number;
  sugars: number;
  total_mass: number;
  pod: number;
  pac: number;
  stabilizers: number;
}

export function tableToRecipe(recipe: RecipeTable): Recipe {
  const {
    id,
    canonical_name,
    version,
    name,
    subtitle,
    created_at,
    estimated_mass,
    base,
    description,
    instructions,
    total_fat,
    milk_fat,
    total_solids,
    total_solids_nonfat,
    milk_solids_nonfat,
    water,
    sugars,
    total_mass,
    pod,
    pac,
    stabilizers,
  } = recipe;

  return {
    id,
    canonicalName: canonical_name,
    version,
    name,
    subtitle,
    createdAt: created_at,
    estimatedMass: estimated_mass,
    base,
    description,
    instructions,
    analysis: {
      totalFat: total_fat,
      milkFat: milk_fat,
      totalSolids: total_solids,
      totalSolidsNonfat: total_solids_nonfat,
      milkSolidsNonfat: milk_solids_nonfat,
      water,
      sugars,
      totalMass: total_mass,
      pod,
      pac,
      stabilizers,
    },
    ingredients: [],
  };
}

export function tableToRecipeSummary(
  recipe: RecipeTableSummary,
): RecipeSummary {
  const { id, name, canonical_name, subtitle, created_at } = recipe;

  return {
    id,
    name,
    canonicalName: canonical_name,
    subtitle,
    createdAt: created_at,
  };
}
