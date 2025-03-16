import {
  Recipe,
  RecipeIngredient,
  RecipeIngredientAmount,
  RecipeSummary,
} from '../../types';
import { query, Queryable } from '../db';
import {
  RecipeIngredientTable,
  RecipeIngredientTableName,
  tableToRecipeIngredientAmount,
} from '../tables/recipe-ingredients';
import {
  RecipeTable,
  RecipeTableName,
  RecipeTableSummary,
  tableToRecipe,
  tableToRecipeSummary,
} from '../tables/recipes';

export async function selectAllRecipes(
  client?: Queryable,
): Promise<RecipeSummary[]> {
  const selectQuery = `
    SELECT id, canonical_name, name, subtitle FROM ${RecipeTableName}
  `;

  const results: RecipeTableSummary[] = (await query(selectQuery, [], client))
    .rows;

  return results.map((r) => tableToRecipeSummary(r));
}

export async function selectRecipe(
  canonicalName: string,
  client?: Queryable,
): Promise<Recipe | undefined> {
  const selectQuery = `
    SELECT * FROM ${RecipeTableName}
    WHERE canonical_name = $1
  `;

  const results: RecipeTable[] = (
    await query(selectQuery, [canonicalName], client)
  ).rows;

  if (!results.length) {
    return;
  }

  return tableToRecipe(results[0]);
}

// TODO: create a query that uses JOIN to use recipe ingredients
// for selecting recipes together with the ingredients.
export async function selectRecipeIngredients(
  recipeId: string,
  client?: Queryable,
): Promise<RecipeIngredientAmount[]> {
  const selectQuery = `
    SELECT * FROM ${RecipeIngredientTableName}
    WHERE recipe_id = $1
  `;

  const results: RecipeIngredientTable[] = (
    await query(selectQuery, [recipeId], client)
  ).rows;

  return results.map((r) => tableToRecipeIngredientAmount(r));
}

export async function insertRecipe(recipe: Recipe, client?: Queryable) {
  const insertQuery = `
    INSERT INTO ${RecipeTableName} (
      id,
      name,
      canonical_name,
      description,
      subtitle,
      created_at,
      instructions,
      base,
      estimated_mass,
      version,
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
      stabilizers
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
      $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
    )`;

  const {
    id,
    name,
    canonicalName,
    description,
    subtitle,
    createdAt,
    instructions,
    base,
    estimatedMass,
    version,
    analysis,
  } = recipe;

  await query(
    insertQuery,
    [
      id,
      name,
      canonicalName,
      description,
      subtitle,
      createdAt,
      instructions,
      base,
      estimatedMass,
      version,
      analysis.totalFat,
      analysis.milkFat,
      analysis.totalSolids,
      analysis.totalSolidsNonfat,
      analysis.milkSolidsNonfat,
      analysis.water,
      analysis.sugars,
      analysis.totalMass,
      analysis.pod,
      analysis.pac,
      analysis.stabilizers,
    ],
    client,
  );
}
export async function insertRecipeIngredient(
  recipeId: string,
  ri: RecipeIngredient,
  client?: Queryable,
) {
  const insertQuery = `
    INSERT INTO ${RecipeIngredientTableName} (
      recipe_id,
      ingredient_id,
      quantity,
      unit
    ) VALUES (
      $1, $2, $3, $4
    )`;

  const { ingredientId, quantity, unit } = ri;
  await query(insertQuery, [recipeId, ingredientId, quantity, unit], client);
}
