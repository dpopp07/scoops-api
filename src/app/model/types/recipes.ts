import type { Preparable, RecipeIngredient } from './ingredients';

export interface RecipeSummary {
  id: string;
  name: string;
  subtitle: string;
  canonicalName: string;
}

export interface RecipeCollection {
  recipes: RecipeSummary[];
}

export interface RecipePrototype extends Preparable {
  name: string;
  subtitle: string;
  estimatedMass: number;
  base: string;
}

export interface Analysis {
  totalFat: number;
  milkFat: number;
  totalSolids: number;
  totalSolidsNonfat: number;
  milkSolidsNonfat: number;
  water: number;
  sugars: number;
  totalMass: number;
  pod: number;
  pac: number;
  stabilizers: number;
}

export interface Recipe extends RecipePrototype {
  id: string;
  canonicalName: string;
  analysis: Analysis;
  ingredients: RecipeIngredient[];
  version: number;
}
