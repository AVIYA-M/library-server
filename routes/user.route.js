import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';

import { validateBody } from '../middlewares/custom.middleware.js';
import { createUserSchema } from '../schemas/user.schema.js';


router.get('/', userController.getAllUsers);
router.post('/sign-up', validateBody(createUserSchema), userController.signUp);

router.post('/sign-in', userController.signIn);

export default router;