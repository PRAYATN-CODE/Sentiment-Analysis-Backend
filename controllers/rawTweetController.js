import RawTweet from '../models/RawTweet.js';
import { insertRawTweets } from '../utils/tweetUtils.js';

export const addRawTweet = async (req, res) => {
    const inputData = req.body;
    const userId = req.user._id;

    try {
        // Validate input
        if (!userId || !inputData) {
            return res.status(400).json({ msg: 'User ID and tweet data are required.' });
        }

        // Normalize input to array
        const tweetsArray = Array.isArray(inputData) ? inputData : [inputData];

        // Prepare clean tweet data
        const cleanTweets = tweetsArray.map(item => {
            // Handle case where tweetText is sent as separate field
            if (inputData.tweetText && !item.tweetText) {
                return {
                    tweetText: item,
                    source: inputData.source,
                    tweetId: inputData.tweetId,
                    author_id: inputData.author_id,
                    language: inputData.language
                };
            }
            // Handle complete tweet objects
            return {
                tweetText: item.tweetText || item,
                source: item.source || inputData.source || 'user',
                tweetId: item.tweetId || inputData.tweetId,
                author_id: item.author_id || inputData.author_id,
                language: item.language || inputData.language || 'en'
            };
        });

        // Use the utility function
        const result = await insertRawTweets(userId, cleanTweets);

        res.status(201).json({
            success: true,
            count: result.length,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            msg: `Failed to save raw tweet(s): ${error.message}`,
            error: error.errors
        });
    }
};

export const getUserRawTweets = async (req, res) => {
    const userId = req.user._id;
    const { source, language, author_id } = req.query; // Optional filters

    try {
        // Validate input
        if (!userId) {
            return res.status(400).json({ msg: 'User ID is required.' });
        }

        // Build query
        const query = { userId };
        if (source) query.source = source;
        if (language) query.language = language;
        if (author_id) query.author_id = author_id;

        // Find all raw tweets for the user
        const rawTweets = await RawTweet.find(query)
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: rawTweets.length,
            data: rawTweets,
        });
    } catch (error) {
        res.status(500).json({
            msg: `Failed to fetch user raw tweets: ${error.message}`
        });
    }
};