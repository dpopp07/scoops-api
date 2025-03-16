import { Identifiable, Ingredient, RecipeIngredientSummary } from '../../types';
import { query, Queryable } from '../db';
import {
  IngredientTable,
  IngredientTableName,
  tableToIngredient,
} from '../tables/ingredients';
import {
  PrepIngredientTable,
  PrepIngredientTableName,
  tableToPrepIngredient,
} from '../tables/preparation-ingredients';

export async function selectIngredient(
  name: string,
  client?: Queryable,
): Promise<Ingredient | undefined> {
  const selectQuery = `
    SELECT * FROM ${IngredientTableName}
    WHERE name = $1
  `;

  const results: IngredientTable[] = (await query(selectQuery, [name], client))
    .rows;

  if (!results.length) {
    return;
  }

  return tableToIngredient(results[0]);
}

export async function selectIngredients(
  ids: string[],
  client?: Queryable,
): Promise<Ingredient[]> {
  const selectQuery = `
    SELECT * FROM ${IngredientTableName}
    WHERE id = ANY($1::uuid[])
  `;

  const results: IngredientTable[] = (await query(selectQuery, [ids], client))
    .rows;

  return results.map((r) => tableToIngredient(r));
}

export async function selectIngredientIds(
  names: string[],
  client?: Queryable,
): Promise<Identifiable[]> {
  const selectQuery = `
    SELECT id FROM ${IngredientTableName}
    WHERE name = ANY($1::varchar[])
  `;

  return (await query(selectQuery, [names], client)).rows;
}

export async function selectPrepIngredients(
  ids: string[],
  client?: Queryable,
): Promise<Record<string, RecipeIngredientSummary[]>> {
  const selectQuery = `
    SELECT * FROM ${PrepIngredientTableName}
    WHERE ingredient_id = ANY($1::uuid[])
  `;

  const results: PrepIngredientTable[] = (
    await query(selectQuery, [ids], client)
  ).rows;

  return results.reduce(
    (record, prepIngredient) => {
      const ingredientId = prepIngredient.ingredient_id;

      if (!record[ingredientId]) {
        record[ingredientId] = [];
      }

      record[ingredientId].push(tableToPrepIngredient(prepIngredient));

      return record;
    },
    {} as Record<string, RecipeIngredientSummary[]>,
  );
}

export async function insertIngredient(
  ingredient: Ingredient,
  client?: Queryable,
) {
  const insertQuery = `
    INSERT INTO ${IngredientTableName} (
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
      created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15, $16
    )`;

  const { id, name, description, category, data, preparation, createdAt } =
    ingredient;

  await query(
    insertQuery,
    [
      id,
      name,
      description,
      category,
      data?.pod,
      data?.pac,
      data?.milkFat,
      data?.otherFat,
      data?.milkSolidsNonfat,
      data?.otherSolidsNonfat,
      data?.water,
      data?.sugars,
      data?.stabilizers,
      preparation?.instructions,
      preparation?.description,
      createdAt,
    ],
    client,
  );
}

export async function insertPrepIngredient(
  ingredientId: string,
  prep: RecipeIngredientSummary,
  client?: Queryable,
) {
  const insertQuery = `
    INSERT INTO ${PrepIngredientTableName} (
      ingredient_id,
      name,
      quantity,
      unit
    ) VALUES (
      $1, $2, $3, $4
    )`;

  const { name, quantity, unit } = prep;
  await query(insertQuery, [ingredientId, name, quantity, unit], client);
}
