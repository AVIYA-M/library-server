import express from 'express';
const router = express.Router();
import * as bookController from '../controllers/book.controller.js';

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.patch('/borrow/:id', bookController.borrowBook);
router.patch('/return/:id', bookController.returnBook);

export default router;