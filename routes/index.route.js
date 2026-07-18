import express from 'express';
const router = express.Router();

import bookRouter from './book.route.js';
import userRouter from './user.route.js';

router.use('/books', bookRouter);
router.use('/users', userRouter);

export default router;