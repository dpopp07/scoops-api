import express from 'express';
import morgan from 'morgan';

const preRoutingMiddleware = express.Router();

preRoutingMiddleware.use(morgan('dev'));

export {
  preRoutingMiddleware,
};
