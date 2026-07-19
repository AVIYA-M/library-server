
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
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        error: {
            message: err.message || "Internal Server Error",
            type: "server error",
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        }
    });
};