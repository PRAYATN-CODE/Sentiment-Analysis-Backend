import { Router } from 'express';
import { getTweetById, searchTweets } from '../controllers/twitterController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// GET /tweets/search/:query - Search recent tweets
router.get('/search/:query', authMiddleware, searchTweets);

// GET /tweets/:id - Fetch a specific tweet by ID
router.get('/:id', getTweetById);

export default router;