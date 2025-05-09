import mongoose from 'mongoose';
import RawTweet from '../models/RawTweet.js';

export const insertRawTweets = async (userId, tweets) => {
    // Ensure we have an array
    const tweetsArray = Array.isArray(tweets) ? tweets : [tweets];

    // Prepare documents with proper field mapping
    const tweetDocs = tweetsArray.map(tweet => ({
        userId,
        tweetText: tweet.tweetText || tweet, // Handle both objects and strings
        source: tweet.source || 'user',
        tweetId: tweet.tweetId || new mongoose.Types.ObjectId().toString(),
        author_id: tweet.author_id || null,
        language: tweet.language || 'en'
    }));

    return await RawTweet.insertMany(tweetDocs);
};