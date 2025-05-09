import { config } from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';

// Load environment variables
config();

// Initialize Twitter client with Bearer Token
const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

export default client;