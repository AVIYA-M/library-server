import express from 'express';
import { books } from './db.js'; 

const app = express();
const PORT = 5000;


app.use(express.json());


app.get('/', (req, res) => {
    res.send("ברוכים הבאים לשרת הספרייה שלנו!");
});


app.get('/books', (req, res) => {
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
});

app.get('/books/:id', (req, res) => {
    const bookId = Number(req.params.id);
    
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        return res.status(404).json({ message: "הספר המבוקש לא נמצא במערכת" });
    }
    
    res.json(book);
});

app.post('/books', (req, res) => {
    const { name, category, price } = req.body;

    if (!name || !category || !price) {
        return res.status(400).json({ message: "נא לשלוח את כל שדות החובה: שם, קטגוריה ומחיר" });
    }

    const newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;

    const newBook = {
        id: newId,
        name,
        category,
        price: Number(price),
        isBorrowed: false, 
        borrows: []        
    };

    books.push(newBook);

    res.status(201).json(newBook);
});


app.delete('/books/:id', (req, res) => {
    const bookId = Number(req.params.id);
    
    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1) {
        return res.status(404).json({ message: "לא ניתן למחוק, הספר המבוקש לא נמצא" });
    }
    
    books.splice(bookIndex, 1);
    
    res.json({ message: "הספר נמחק בהצלחה מהמערכת" });
});


app.put('/books/:id', (req, res) => {
    const bookId = Number(req.params.id);
    
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        return res.status(404).json({ message: "הספר המבוקש לעדכון לא נמצא" });
    }
    
    const { name, category, price } = req.body;
    
    if (!name || !category || !price) {
        return res.status(400).json({ message: "נא לשלוח את כל השדות לעדכון: שם, קטגוריה ומחיר" });
    }
    
    book.name = name;
    book.category = category;
    book.price = Number(price);
    
    res.json(book);
});


app.patch('/books/borrow/:id', (req, res) => {
    const bookId = Number(req.params.id);
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        return res.status(404).json({ message: "הספר המבוקש לא נמצא" });
    }
    
    if (book.isBorrowed) {
        return res.status(400).json({ message: "הספר כבר מושאל ללקוח אחר כרגע" });
    }
    
    const { clientId } = req.body;
    if (!clientId) {
        return res.status(400).json({ message: "נא לספק קוד לקוח (clientId) לצורך ביצוע ההשאלה" });
    }
    
    book.isBorrowed = true;
    
    const currentDate = new Date().toISOString().split('T')[0];
    book.borrows.push({
        borrowDate: currentDate,
        clientId: Number(clientId)
    });
    
    res.json({ message: "הספר הושאל בהצלחה!", book });
});

app.patch('/books/return/:id', (req, res) => {
    const bookId = Number(req.params.id);
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        return res.status(404).json({ message: "הספר המבוקש לא נמצא" });
    }
    
    if (!book.isBorrowed) {
        return res.status(400).json({ message: "הספר כבר נמצא בספרייה ואינו מושאל" });
    }
    
    book.isBorrowed = false;
    
    res.json({ message: "הספר הוחזר לספרייה בהצלחה!", book });
});

app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});