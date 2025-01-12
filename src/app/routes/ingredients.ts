import express from 'express';
import * as controller from '../controllers/ingredients';
import { isAdmin } from '../middleware';

const ingredientsRouter = express.Router();

ingredientsRouter.post('/', isAdmin, controller.createIngredient);

export { ingredientsRouter };
