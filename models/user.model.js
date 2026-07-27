import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'שם משתמש הוא שדה חובה']
    },
    email: {
        type: String,
        required: [true, 'מייל הוא שדה חובה'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'מספר הטלפון הוא שדה חובה'],
        match: [/^0[2-9]\d{7,8}$|^05[0-9]{8}$/, 'מספר הטלפון אינו תקין (נדרש מספר טלפון ישראלי)'] 
    },
    password: {
        type: String,
        required: [true, 'סיסמה היא שדה חובה'],
        minlength: [4, 'הסיסמה חייבת להכיל לפחות 4 תווים']
    },
    registrationDate: {
        type: Date,
        default: Date.now 
    },
    borrowedBooks: [
        {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
            bookCode: { type: String, required: true },
            bookName: { type: String, required: true },
            returnDate: { type: Date, required: true }
        }
    ]

});


const User = mongoose.model('User', userSchema);
export default User;