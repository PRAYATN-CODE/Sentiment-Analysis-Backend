import express from 'express';
import { addRawTweet, getUserRawTweets } from '../controllers/rawTweetController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/rawtweets - Add a new raw tweet
router.post('/', authMiddleware, addRawTweet);

// GET /api/rawtweets - Get all raw tweets for the authenticated user
router.get('/', authMiddleware, getUserRawTweets);

export default router;