import Joi from 'joi';

// סכמה 3: יצירת משתמש חדש 
export const createUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.empty': 'שם המשתמש אינו יכול להיות ריק',
        'any.required': 'שם המשתמש הוא שדה חובה'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'כתובת האימייל אינה תקינה',
        'any.required': 'כתובת האימייל היא שדה חובה'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'הסיסמה אינה יכולה להיות ריקה',
        'string.min': 'הסיסמה חייבת להכיל לפחות 6 תווים',
        'any.required': 'הסיסמה היא שדה חובה'
    })
});