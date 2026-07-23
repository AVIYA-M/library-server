import Book from '../models/book.model.js';

// 1. קבלת כל הספרים
export const getAllBooks = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchName = req.query.name;

        const filter = {};
        if (searchName) {
            filter.title = { $regex: searchName, $options: 'i' };
        }

        const totalResults = await Book.countDocuments(filter);
        const books = await Book.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            currentPage: page,
            limitPerPage: limit,
            totalResults,
            totalPages: Math.ceil(totalResults / limit),
            data: books
        });
    } catch (error) {
        next(error); 
    }
};

// 2. קבלת ספר לפי ID
export const getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "הספר המבוקש לא נמצא במערכת" });
        }
        res.json(book);
    } catch (error) {
        next(error);
    }
};

// 3. יצירת ספר חדש
export const createBook = async (req, res, next) => {
    try {
        const { title, categories, price, author } = req.body;

        if (!title || !price) {
            return res.status(400).json({ message: "נא לספק לפחות שם ספר  ומחיר" });
        }

        const newBook = new Book({
            title,
            price: Number(price),
            categories: categories || [],
            author
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        next(error);
    }
};

// 4. עדכון ספר לפי ID
export const updateBook = async (req, res, next) => {
    try {
        const { title, categories, price, author } = req.body;

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, categories, price, author },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "הספר המבוקש לעדכון לא נמצא" });
        }

        res.json(updatedBook);
    } catch (error) {
        next(error);
    }
};

// 5. מחיקת ספר לפי ID
export const deleteBook = async (req, res, next) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: "הספר המבוקש למחיקה לא נמצא" });
        }
        res.json({ message: "הספר נמחק בהצלחה", book: deletedBook });
    } catch (error) {
        next(error);
    }
};