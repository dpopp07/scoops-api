import express from 'express';

const postRoutingMiddleware = express.Router();

postRoutingMiddleware.use(routeNotFoundHandler);
postRoutingMiddleware.use(catchAllErrorHandler);

export {
  postRoutingMiddleware,
};

function catchAllErrorHandler(err, req, res, next) {
  console.log('Internal server error:', err);
  res.status(500);
}

function routeNotFoundHandler(req, res, next) {
  console.log('Requested and not found:', req.originalUrl);
  res.status(404); 
}
