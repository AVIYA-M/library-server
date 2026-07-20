import Joi from 'joi';

// סכמה 1: הוספת ספר חדש 
// כל השדות חובה
export const createBookSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'שם הספר אינו יכול להיות ריק',
        'any.required': 'שם הספר הוא שדה חובה'
    }),
    category: Joi.string().min(2).max(50).required().messages({
        'string.empty': 'הקטגוריה אינה יכולה להיות ריקה',
        'any.required': 'קטגוריה היא שדה חובה'
    }),
    price: Joi.number().positive().required().messages({
        'number.base': 'המחיר חייב להיות מספר',
        'any.required': 'המחיר הוא שדה חובה'
    })
});

// סכמה 2: עדכון ספר קיים 
//לא חובה למלא  הכל
export const updateBookSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    category: Joi.string().min(2).max(50),
    price: Joi.number().positive()
}).min(1);