import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password; 
    userObject.id = userObject._id; 
    delete userObject._id;     
    delete userObject.__v;     
    return userObject;
};

userSchema.pre('save', async function () {
    if (!this.password) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

userSchema.statics.findByCredentials = async function (email, password) {

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('שמך או הסיסמה שלך שגויים');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('שמך או הסיסמה שלך שגויים');
    }

    return user;
};

const User = mongoose.model('User', userSchema);
export default User;