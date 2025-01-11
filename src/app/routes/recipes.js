import express from 'express';
import { listRecipes, getRecipe } from '../controllers/recipes.js';

const recipesRouter = express.Router();

recipesRouter.get('/', listRecipes)
recipesRouter.get('/:id', getRecipe)

export {
   recipesRouter,
};
