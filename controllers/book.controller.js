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

        res.status(200).json({
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
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

// 3. יצירת ספר חדש
export const createBook = async (req, res, next) => {
    try {
        const { title, categories, price, author ,bookCode} = req.body;

        const newBook = new Book({
            title,
            bookCode,
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
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "הספר המבוקש לעדכון לא נמצא" });
        }

        res.status(200).json(updatedBook);
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
        res.status(200).json({ message: "הספר נמחק בהצלחה", book: deletedBook });
    } catch (error) {
        next(error);
    }
};

// 6. קבלת ספרים לפי קטגוריה 
export const getBooksByCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.params; 

        const books = await Book.find({ categories: categoryName });

        res.status(200).json({
            category: categoryName,
            totalResults: books.length,
            data: books
        });
    } catch (error) {
        next(error);
    }
};