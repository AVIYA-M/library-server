import express from 'express';
import { books } from './db.js'; 

const app = express();
const PORT = 5000;


app.use(express.json());


app.get('/', (req, res) => {
    res.send("ברוכים הבאים לשרת הספרייה שלנו!");
});


app.get('/books', (req, res) => {
    res.json(books);
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

app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});