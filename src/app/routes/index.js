import express from 'express';
import { recipesRouter } from './recipes.js';

// Set up router for API with all top-level paths.
const apiRouter = express.Router();

apiRouter.use('/v0/recipes', recipesRouter);

export {
  apiRouter,
};
