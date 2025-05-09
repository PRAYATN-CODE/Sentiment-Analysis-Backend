import express from 'express';
import { analyzeTweet, analyzeTweetById, getUserTweets } from '../controllers/tweetController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/analyze').post(authMiddleware, analyzeTweet);
router.route('/analyzetweetbyid').post(authMiddleware, analyzeTweetById);
router.route('/').get(authMiddleware, getUserTweets); // Protected route to get all tweets for the authenticated user

export default router;