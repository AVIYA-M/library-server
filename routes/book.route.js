import express from 'express';
const router = express.Router();
import * as bookController from '../controllers/book.controller.js';

import { validateBody } from '../middlewares/custom.middleware.js';
import { createBookSchema, updateBookSchema } from '../schemas/book.schema.js';

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

router.post('/', validateBody(createBookSchema), bookController.createBook);
router.put('/:id', validateBody(updateBookSchema), bookController.updateBook);

router.delete('/:id', bookController.deleteBook);
//router.patch('/borrow/:id', bookController.borrowBook);
//router.patch('/return/:id', bookController.returnBook);

export default router;