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
    phone: Joi.string().pattern(/^0[2-9]\d{7,8}$|^05[0-9]{8}$/).required().messages({
        'string.pattern.base': 'מספר הטלפון אינו תקין (נדרש מספר טלפון ישראלי)',
        'any.required': 'מספר הטלפון הוא שדה חובה'
    }),
    password: Joi.string().min(4).required().messages({
        'string.empty': 'הסיסמה אינה יכולה להיות ריקה',
        'string.min': 'הסיסמה חייבת להכיל לפחות 4 תווים',
        'any.required': 'הסיסמה היא שדה חובה'
    }),
    borrowedBooks: Joi.array().items(
        Joi.object({
             bookCode: Joi.string().required(),
             borrowedName: Joi.date().required()
        })
    ).optional()    


});