import RawTweet from '../models/RawTweet.js';
import Tweet from '../models/Tweet.js';
import { generateResult } from '../utils/geminiUtils.js';

export const analyzeTweet = async (req, res) => {
    const { tweetText } = req.body;

    const user = req.user;
    const userId = user._id; // Assuming req.user contains the authenticated user's information

    try {

        // Validate input
        if (!userId || !tweetText) {
            return res.status(400).json({ msg: 'User ID and tweet text are required.' });
        }

        const result = await generateResult(tweetText);
        const analysis = result;

        // Save tweet with analysis to database
        const tweet = await Tweet.create({
            userId,
            tweetText,
            sentiment: analysis.sentiment,
            sentimentScore: analysis.sentimentScore,
            behavior: analysis.behavior,
        });

        res.status(201).json({
            success: true,
            data: tweet,
        });
    } catch (error) {
        res.status(500).json({ msg: `Failed to analyze tweet: ${error.message}` });
    }
};

export const analyzeTweetById = async (req, res) => {
    const { _id } = req.query;
    const user = req.user;
    const userId = user._id;

    try {
        // Validate input
        if (!_id || !userId) {
            return res.status(400).json({ msg: 'Tweet ID and user ID are required.' });
        }

        // Find the raw tweet using the provided ID
        const rawTweet = await RawTweet.findById(_id);
        if (!rawTweet) {
            return res.status(404).json({ msg: 'Raw tweet not found.' });
        }

        const tweetText = rawTweet.tweetText;

        // Analyze the tweet text
        const analysis = await generateResult(tweetText);

        // Save tweet with analysis to database
        const tweet = await Tweet.create({
            userId,
            tweetText,
            sentiment: analysis.sentiment,
            sentimentScore: analysis.sentimentScore,
            behavior: analysis.behavior,
        });

        res.status(201).json({
            success: true,
            data: tweet,
        });
    } catch (error) {
        res.status(500).json({ msg: `Failed to analyze tweet by ID: ${error.message}` });
    }
};

// New function to get all tweets for the authenticated user
export const getUserTweets = async (req, res) => {
    const user = req.user;
    const userId = user._id;

    try {
        // Validate input
        if (!userId) {
            return res.status(400).json({ msg: 'User ID is required.' });
        }

        // Find all tweets for the user, sorted by creation date (newest first)
        const tweets = await Tweet.find({ userId }).sort({ createdAt: -1 }).lean();

        res.status(200).json({
            success: true,
            count: tweets.length,
            data: tweets,
        });
    } catch (error) {
        res.status(500).json({
            msg: `Failed to fetch user tweets: ${error.message}`
        });
    }
};