import mongoose from 'mongoose';

// הגדרת סכמה לפרטי הסופר
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String }
}, { _id: false });

// הגדרת סכמה לספר
const bookSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: [true, 'שם הספר הוא שדה חובה'],
        minlength: [2, 'שם הספר חייב להכיל לפחות 2 תווים'],
        maxlength: [20, 'שם הספר יכול להכיל עד 20 תווים'],
        unique: true, 
        trim: true
    },
    price: { 
        type: Number,
        required: [true, 'מחיר הספר הוא שדה חובה']
    },
    categories: {
        type: [{ 
            type: String,
            enum: {
                values: ['fiction', 'science', 'history', 'biography', 'fantasy'],
                message: 'קטגוריית הספר אינה תקינה'
            }
        }],
        required: [true, 'חובה לבחור לפחות קטגוריה אחת']
    },
    author: authorSchema
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;