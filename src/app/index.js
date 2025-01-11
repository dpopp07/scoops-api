import express from 'express';
import cors from 'cors';

import { apiRouter } from './routes/index.js';
import { preRoutingMiddleware, postRoutingMiddleware } from './middleware/index.js';

// Set up app.
const app = express();

// Disable the etag for now, to have greater control over status codes.
app.disable('etag');

// Middleware to use before routing to the API.
app.use(preRoutingMiddleware);

// Mount the API routes.
// TODO: Currently enabling all cross-origin requests,
// need to update that prior to deploying a production app.
app.use('/api', cors(), apiRouter);

// Middleware to use after routing through the API.
app.use(postRoutingMiddleware);

export {
  app,
};
