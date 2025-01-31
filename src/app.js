import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import faqRouter from './routes/faqRoutes.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());





// routes
app.use('/faq', faqRouter);




app.get('/healthcheck', (req, res) => {
  res.send.json({ message: 'Welcome to the API' });
});









const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
}); 

