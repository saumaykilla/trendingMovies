// backend/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import trendingRouter from './routes/trending';
import movieRouter from './routes/movie';

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/trending', trendingRouter);
app.use('/movie', movieRouter);
// Example route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend!' });
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
