import express from 'express';

import { ingredientsRouter } from './ingredients';
import { recipesRouter } from './recipes';
import { usersRouter } from './users';

// Set up router for API with all top-level paths.
const apiRouter = express.Router();

apiRouter.use('/v0/recipes', recipesRouter);
apiRouter.use('/v0/ingredients', ingredientsRouter);
apiRouter.use('/v0/users', usersRouter);

export { apiRouter };
