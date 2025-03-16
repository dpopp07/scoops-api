export interface Preparable {
  description: string;
  instructions: string[];
  ingredients: RecipeIngredientSummary[];
}

interface Amount {
  quantity: number;
  unit?: string;
}

export interface RecipeIngredientAmount extends Amount {
  ingredientId: string;
}

export interface RecipeIngredientSummary extends Amount {
  name: string;
}

export interface RecipeIngredient extends RecipeIngredientSummary {
  ingredientId: string;
  preparation?: Preparable;
  category: IngredientCategory;
}

export enum IngredientCategory {
  Solids = 'solids',
  Dairy = 'dairy',
  Other = 'other',
  Steeping = 'steeping',
  Finishing = 'finishing',
  Churning = 'churning',
  Drawing = 'drawing',
}

export interface IngredientData {
  pod?: number;
  pac?: number;
  milkFat?: number;
  otherFat?: number;
  milkSolidsNonfat?: number;
  otherSolidsNonfat?: number;
  water?: number;
  sugars?: number;
  stabilizers?: number;
}

export interface AnalyzableIngredient {
  data?: IngredientData;
  category: IngredientCategory;
}

export interface IngredientPrototype extends AnalyzableIngredient {
  name: string;
  description: string;
  preparation?: Preparable;
}

export interface Ingredient extends IngredientPrototype {
  id: string;
  createdAt: string;
}

export interface IngredientMap {
  [ingredientName: string]: Ingredient;
}

export interface AnalyzableIngredientMap {
  [ingredientName: string]: AnalyzableIngredient;
}
