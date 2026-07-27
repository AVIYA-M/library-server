import Joi from 'joi';

const allowedCategories = ['fiction', 'science', 'history', 'biography', 'fantasy'];

// סכמה 1: הוספת ספר חדש 
// כל השדות חובה
export const createBookSchema = Joi.object({
    title: Joi.string().min(2).max(20).required().messages({
        'string.empty': 'שם הספר אינו יכול להיות ריק',
        'string.min': 'שם הספר חייב להכיל לפחות 2 תווים',
        'string.max': 'שם הספר יכול להכיל עד 20 תווים בלבד',
        'any.required': 'שם הספר הוא שדה חובה'
    }),
    price: Joi.number().required().messages({
        'number.base': 'מחיר הספר חייב להיות מספר',
        'any.required': 'מחיר הספר הוא שדה חובה'
    }),
    categories: Joi.array().items(Joi.string().valid(...allowedCategories)
    ).min(1).required().messages({
        'array.min': 'חובה לבחור לפחות קטגוריה אחת',
        'any.only': 'אחת או יותר מהקטגוריות שנבחרו אינן תקינות',
        'any.required': 'קטגוריה היא שדה חובה'
    }),
    author: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'שם הסופר הוא שדה חובה'
        }),
        phone: Joi.string().optional(),
        email: Joi.string().email().optional().messages({
            'string.email': 'כתובת האימייל של הסופר אינה תקינה'
        })
    }).required().messages({
        'any.required': 'פרטי הסופר הם שדה חובה'
    })
});

// סכמה 2: עדכון ספר קיים 
//לא חובה למלא  הכל
export const updateBookSchema = Joi.object({
    title: Joi.string().min(2).max(20).optional().messages({
        'string.min': 'שם הספר חייב להכיל לפחות 2 תווים',
        'string.max': 'שם הספר יכול להכיל עד 20 תווים בלבד'
    }),
    price: Joi.number().min(0).optional().messages({
        'number.base': 'מחיר הספר חייב להיות מספר'
    }),
    categories: Joi.array().items(
        Joi.string().valid(...allowedCategories))
    .min(1).optional().messages({
        'any.only': 'אחת או יותר מהקטגוריות שנבחרו אינן תקינות'
      
    }),
    author: Joi.object({
        name: Joi.string().optional(),
        phone: Joi.string().optional(),
        email: Joi.string().email().optional().messages({
            'string.email': 'כתובת האימייל של הסופר אינה תקינה'
        })
    }).optional()
});