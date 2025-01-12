import express from 'express';
import * as controller from '../controllers/users';
import { isAdmin } from '../middleware';

const usersRouter = express.Router();

usersRouter.post('/register', isAdmin, controller.register);

export { usersRouter };
