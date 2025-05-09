import { GoogleGenerativeAI } from '@google/generative-ai';

const configureGemini = () => {
  if (!process.env.GOOGLE_AI_KEY) {
    throw new Error('Google AI API key is not configured');
  }
  return new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
};

export default configureGemini;