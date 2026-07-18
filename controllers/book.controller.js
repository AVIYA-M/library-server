import books from '../db.js';
import users from '../dbUsers.js';

export const getAllBooks = (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const searchName = req.query.name;

    let filteredBooks = books;

    if (searchName) {
        filteredBooks = books.filter(book => 
            book.name.toLowerCase().includes(searchName.toLowerCase())
        );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    res.json({
        currentPage: page,
        limitPerPage: limit,
        totalResults: filteredBooks.length,
        totalPages: Math.ceil(filteredBooks.length / limit),
        data: paginatedBooks
    });
};

export const getBookById = (req, res) => {
    const bookId = Number(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (!book) {
        return res.status(404).json({ message: "הספר המבוקש לא נמצא במערכת" });
    }
    res.json(book);
};

export const createBook = (req, res) => {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
        return res.status(400).json({ message: "נא לשלוח שם, קטגוריה ומחיר" });
    }
    const newBook = {
        id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
        name,
        category,
        price: Number(price),
        isBorrowed: false,
        borrows: []
    };
    books.push(newBook);
    res.status(201).json(newBook);
};

export const updateBook = (req, res) => {
    const bookId = Number(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (!book) {
        return res.status(404).json({ message: "הספר המבוקש לעדכון לא נמצא" });
    }
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
        return res.status(400).json({ message: "נא לשלוח את כל השדות לעדכון" });
    }
    book.name = name;
    book.category = category;
    book.price = Number(price);
    res.json(book);
};

export const deleteBook = (req, res) => {
    const bookId = Number(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
        return res.status(404).json({ message: "הספר המבוקש למחיקה לא נמצא" });
    }
    const deletedBook = books.splice(bookIndex, 1);
    res.json({ message: "הספר נמחק בהצלחה", book: deletedBook[0] });
};

export const borrowBook = (req, res) => {
    const bookId = Number(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (!book) return res.status(404).json({ message: "הספר לא נמצא" });
    if (book.isBorrowed) return res.status(400).json({ message: "הספר כבר מושאל" });

    const { clientId } = req.body;
    if (!clientId) return res.status(400).json({ message: "נא לספק קוד לקוח (clientId)" });

    const user = users.find(u => u.id === Number(clientId));
    if (!user) return res.status(404).json({ message: "המשתמש המשאיל לא נמצא" });

    book.isBorrowed = true;
    const currentDate = new Date().toISOString().split('T')[0];
    book.borrows.push({ borrowDate: currentDate, clientId: Number(clientId) });

    user.borrowedBooks.push(bookId);

    res.json({ message: "הספר הושאל בהצלחה!", book, user });
};

export const returnBook = (req, res) => {
    const bookId = Number(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (!book) return res.status(404).json({ message: "הספר לא נמצא" });
    if (!book.isBorrowed) return res.status(400).json({ message: "הספר אינו מושאל" });

    const lastBorrow = book.borrows[book.borrows.length - 1];
    if (lastBorrow) {
        const user = users.find(u => u.id === lastBorrow.clientId);
        if (user) {
            user.borrowedBooks = user.borrowedBooks.filter(id => id !== bookId);
        }
    }

    book.isBorrowed = false;
    res.json({ message: "הספר הוחזר בהצלחה!", book });
};