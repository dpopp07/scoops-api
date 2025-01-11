// TODO: separate out data-interaction layer,
// with functions that perform the queries, the db, etc.

import * as db from './db.js';

export async function listRecipes(req, res) {
  const recipeTable = await db.query('SELECT * FROM recipes');

  // TODO: figure out if I want full recipe objects, with all ignredients, etc.
  // or not. Should map it out in OpenAPI.

  const recipeCollection = {
    recipes: recipeTable.rows,
  };

  res.status(200).send(recipeCollection);
}

export async function getRecipe(req, res) {
  // This performs joins and JSON aggregation to assemble the appropriate
  // 'ingredients' field within the recipe object.
  const recipeSelect = `
    SELECT * FROM (SELECT recipes.*,
    json_agg(
        json_build_object(
            'ingredient_id', ingredients.id,
            'name', ingredients.name,
            'quantity', recipe_ingredients.quantity
        )
    ) AS ingredients
    FROM recipes
    LEFT JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
    LEFT JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
    GROUP BY recipes.id)
    WHERE id = $1`;

  let recipe = await db.query(recipeSelect, [req.params.id]);

  res.status(200).send(recipe.rows[0]);
}
