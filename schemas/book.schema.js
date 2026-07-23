import Joi from 'joi';

// סכמה 1: הוספת ספר חדש 
// כל השדות חובה
export const createBookSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'שם הספר הוא שדה חובה',
        'any.required': 'שם הספר הוא שדה חובה'
    }),
    price: Joi.number().min(0).required().messages({
        'number.base': 'מחיר חייב להיות מספר',
        'any.required': 'מחיר הוא שדה חובה'
    }),
    categories: Joi.array().items(Joi.string()).optional(),
    author: Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'שם הסופר הוא שדה חובה',
            'any.required': 'שם הסופר הוא שדה חובה'
        }),
        phone: Joi.string().optional(),
        email: Joi.string().email().optional()
    }).optional()
});

// סכמה 2: עדכון ספר קיים 
//לא חובה למלא  הכל
export const updateBookSchema = Joi.object({
    title: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    categories: Joi.array().items(Joi.string()).optional(),
    author: Joi.object({
        name: Joi.string().optional(),
        phone: Joi.string().optional(),
        email: Joi.string().email().optional()
    }).optional()
});