import express from 'express';
import mainRouter from './routes/index.route.js'; 

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("ברוכים הבאים לשרת הספרייה שלנו!");
});

app.use('/api', mainRouter);

app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});