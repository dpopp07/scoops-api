import { rateLimit } from 'express-rate-limit';
import { RateLimitError } from '../errors/rate-limit-error';
import { getLogger } from '../utils';

const logger = getLogger({
  layer: 'middleware',
  function: 'rateLimiter',
});

// Limit each IP to 100 requests per `window` (here, per 15 minutes).
const WindowInSeconds = 15;
const RequestLimit = 100;

export const rateLimiter = rateLimit({
  windowMs: toMs(WindowInSeconds),
  limit: RequestLimit,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

function handler() {
  logger.error('Rate limit exceeded');
  throw new RateLimitError();
}

function toMs(inSeconds: number) {
  return inSeconds * 60 * 1000;
}
