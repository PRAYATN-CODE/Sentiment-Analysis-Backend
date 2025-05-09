import cors from 'cors'; // ✅ Add this
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import connectDB from './config/db.js';
import rawTweetRoutes from './routes/rawTweetRoutes.js';
import tweetRoutes from './routes/tweetRoutes.js';
import twitterRoutes from './routes/twitterRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// ✅ Enable CORS for all origins
app.use(cors());

// Log requests in development
app.use(morgan('dev'));

// Body parser middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/tweets', twitterRoutes);
app.use('/api/rawtweets', rawTweetRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
