import User from '../models/user.model.js';
import Book from '../models/book.model.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליפת המשתמשים', error: error.message });
    }
};

export const signUp = async(req, res) => {
    try {
        const { username, email, password, phone, borrowedBooks } = req.body;

        const newUser = new User({
            username,
            email,
            password,
            phone,
            borrowedBooks: borrowedBooks || []
        });

        await newUser.save();

        res.status(201).json({ 
            message: "ההרשמה בוצעה בהצלחה!", 
            user: { 
                id: newUser._id, 
                username: newUser.username, 
                email: newUser.email 
            } 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "כתובת האימייל כבר קיימת במערכת" });
        }
        res.status(400).json({ message: "שגיאה בהרשמה", error: error.message });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "נא להזין אימייל וסיסמה" });
        }

        const user = await User.findByCredentials(email, password);

        res.status(200).json({ message: "התחברת בהצלחה!", username: user.username });
    } catch (error) {
        res.status(401).json({ message: "אימייל או סיסמה שגויים", error: error.message });
    }
};

export const borrowBook = async (req, res, next) => {
    try {
        const { userId, bookId, returnDate } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "המשתמש לא נמצא" });
        }

        if (user.borrowedBooks.length >= 3) {
            return res.status(400).json({ message: "הגעת למגבלה המקסימלית של 3 ספרים מושאלים" });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "הספר המבוקש לא נמצא במערכת" });
        }

        // 1. בדיקה האם הספר כבר מושאל על ידי משתמש כלשהו במערכת
        const isBookAlreadyBorrowed = await User.findOne({
            "borrowedBooks.bookId": bookId 
        });

        if (isBookAlreadyBorrowed) {
            return res.status(400).json({ message: "הספר כרגע מושאל על ידי משתמש אחר" });
        }

        // 2. בדיקה האם המשתמש הנוכחי כבר השיל את הספר הזה לעצמו
        const isAlreadyInUserList = user.borrowedBooks.some(
            (b) => b.bookId && b.bookId.toString() === bookId
        );

        if (isAlreadyInUserList) {
            return res.status(400).json({ message: "הספר כבר נמצא ברשימת הספרים המושאלים שלך" });
        }

        user.borrowedBooks.push({
            bookId: book._id,
            bookCode: book.bookCode || book._id.toString(),
            bookName: book.title,
            returnDate: returnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        });

        await user.save();

        res.status(200).json({ 
            message: "הספר הושאל בהצלחה!", 
            borrowedBooks: user.borrowedBooks 
        });

    } catch (error) {
        next(error);
    }
};