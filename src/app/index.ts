import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import {
  authenticate,
  bodyParser,
  errorHandler,
  rateLimiter,
  requestId,
  requestLogger,
  routeNotFound,
} from './middleware';

import { apiRouter } from './routes';

// Set up app.
const app = express();

// Enable reverse proxy.
app.set('trust proxy', 1);
app.use(requestId);
app.use(compression());
app.use(cors({ methods: ['GET'] }));
app.use(helmet());

// Disable the etag for now, to have greater control over status codes.
app.disable('etag');

// Middleware to use before routing to the API.
app.use(requestLogger);
app.use(rateLimiter);
app.use(authenticate);
app.use(bodyParser);

// Mount the API routes.
app.use('/api', apiRouter);

// Middleware to use after routing through the API.
app.use(routeNotFound);
app.use(errorHandler);

export { app };
