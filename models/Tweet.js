import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tweetText: {
        type: String,
        required: [true, 'Please provide tweet text'],
        maxlength: [280, 'Tweet cannot exceed 280 characters'],
    },
    sentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
        required: true,
    },
    sentimentScore: {
        type: Number,
        required: true,
    },
    behavior: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Tweet', tweetSchema);