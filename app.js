import express from 'express';
import mainRouter from './routes/index.route.js'; 
import { addCurrentDate, logGetRequestDate, errorHandler } from './middlewares/custom.middleware.js';

import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const app = express();
const PORT = 5000;

// הגדרת מגביל הבקשות
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100, 
    message: { message: "נשלחו יותר מדי בקשות, אנא נסה שוב מאוחר יותר" }
});

// מוסיף כותרות אבטחה אוטומטיות כדי להגן על השרת helmetת
app.use(helmet());

//מאפשר גישה לשרת מכל פרויקט קליינט חיצוני ללא חסימות דפדפן cors 
app.use(cors());

//מדפיס בטרמינל נתונים על כל בקשה שמגיעה לשרת במצב פיתוח morgan
app.use(morgan('dev'));

// מגביל את כמות הבקשות לשרת כדי למנוע הצפות ועומס express-rate-limit
app.use(limiter);


app.use(express.json());

app.get('/', (req, res) => {
    res.send("ברוכים הבאים לשרת הספרייה שלנו!");
});


app.use(addCurrentDate);
app.use(logGetRequestDate);

app.use('/api', mainRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});