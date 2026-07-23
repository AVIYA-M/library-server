import mongoose from 'mongoose';

// הגדרת סכמה לפרטי הסופר
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String }
}, { _id: false });

// הגדרת סכמה לספר
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    categories: [{ type: String }],
    author: authorSchema
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;