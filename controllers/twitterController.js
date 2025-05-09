import { insertRawTweets } from '../utils/tweetUtils.js';
import twitterClient from '../utils/twitterClient.js';


export const searchTweets = async (req, res) => {
    try {
        const { query } = req.params;
        const { country } = req.query;
        const userId = req.user._id; // Get authenticated user's ID

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User authentication required' });
        }

        // Build the search query
        let searchQuery = `${query} lang:en`;
        if (country) {
            searchQuery += ` in:${country}`;
        }

        console.log('Search query:', searchQuery);
        const tweetSearch = await twitterClient.v2.search(searchQuery, {
            'tweet.fields': 'created_at,author_id,lang',
            max_results: 10,
        });

        const tweets = [];
        const tweetsToStore = []; // For storing in RawTweet collection
        
        for await (const tweet of tweetSearch) {
            const tweetData = {
                id: tweet.id,
                text: tweet.text,
                created_at: tweet.created_at,
                author_id: tweet.author_id,
                language: tweet.lang,
            };
            tweets.push(tweetData);

            // Prepare data for RawTweet collection
            tweetsToStore.push({
                tweetText: tweet.text,
                source: 'twitter',
                tweetId: tweet.id,
                author_id: tweet.author_id,
                language: tweet.lang || 'en'
            });
        }

        // Store tweets in RawTweet collection
        if (tweetsToStore.length > 0) {
            await insertRawTweets(userId, tweetsToStore, 'twitter');
            console.log(`Stored ${tweetsToStore.length} tweets in RawTweet collection`);
        }

        console.log('Tweets fetched:', tweets.length);
        res.status(200).json({ 
            success: true,
            count: tweets.length,
            tweets,
            storedCount: tweetsToStore.length
        });
    } catch (error) {
        console.error('Error fetching tweets:', error.message, error.data);
        res.status(500).json({
            error: 'Failed to fetch tweets',
            details: error.data || error.message,
        });
    }
};
// Fetch a specific tweet by ID (no language or country filter)
export const getTweetById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Tweet ID:', id);
        if (!id) {
            return res.status(400).json({ error: 'Tweet ID is required' });
        }

        console.log('Making Twitter API request for single tweet...');
        const tweet = await twitterClient.v2.singleTweet(id, {
            'tweet.fields': 'created_at,author_id,lang',
        });

        res.status(200).json({
            tweet: {
                id: tweet.data.id,
                text: tweet.data.text,
                created_at: tweet.data.created_at,
                author_id: tweet.data.author_id,
                language: tweet.data.lang, // Include language for verification
            },
        });
    } catch (error) {
        console.error('Error fetching tweet:', error.message, error.data);
        res.status(500).json({
            error: 'Failed to fetch tweet',
            details: error.data || error.message,
        });
    }
};