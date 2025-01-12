import { User } from '..';

// Extend Express Request type with custom fields.
declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
