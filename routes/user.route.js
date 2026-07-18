import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';

router.get('/', userController.getAllUsers);
router.post('/sign-up', userController.signUp);
router.post('/sign-in', userController.signIn);

export default router;