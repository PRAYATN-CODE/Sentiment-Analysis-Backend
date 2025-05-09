import mongoose from 'mongoose';

const rawTweetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tweetText: {
        type: String,
        required: [true, 'Please provide tweet text'],
    },
    source: {
        type: String,
        required: [true, 'Please provide tweet source'],
        enum: ['user', 'twitter', 'api', 'other'],
        default: 'user'
    },
    tweetId: {
        type: String,
        default: () => mongoose.Types.ObjectId().toString(), // Generate random ID if not provided
        index: true
    },
    author_id: {
        type: String,
        default: null // Will be null if not provided
    },
    language: {
        type: String,
        default: 'en',
    }
}, {
    timestamps: true,
});

export default mongoose.model('RawTweet', rawTweetSchema);