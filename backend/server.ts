// backend/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const trendingRouter = require('./routes/trending');
dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/trending', trendingRouter);
// Example route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend!' });
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
