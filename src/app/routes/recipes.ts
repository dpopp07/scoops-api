import express from 'express';
import * as controller from '../controllers/recipes';
import { isAdmin } from '../middleware';

const recipesRouter = express.Router();

recipesRouter.get('/', controller.listRecipes);
recipesRouter.get('/:canonicalName', controller.getRecipe);
recipesRouter.post('/', isAdmin, controller.createRecipe);

export { recipesRouter };
