
export const addCurrentDate = (req, res, next) => {
    req.currentDate = new Date(); 
    next(); 
};

export const logGetRequestDate = (req, res, next) => {
    if (req.method === 'GET') {
        console.log(`Date: ${req.currentDate}`);
    }
    next(); 
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
    
    res.status(statusCode).json({
        error: {
            message: err.message || "Internal Server Error",
            type: "server error",
            details: err.details || null,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        }
    });
};

// מידלוור  לבדיקת תקינות הנתונים
export const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            
            const validationError = new Error("Validation Failed");
            validationError.status = 400;
            validationError.details = errorMessages; 
            
            return next(validationError);
        }
        
        next();
    };
};