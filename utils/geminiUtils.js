import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    console.log("GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sentimentAnalysisInstruction = {
    role: 'system',
    parts: [{
        text: `You are a sentiment analysis expert for tweets. Analyze the following tweet and respond using this exact JSON format:
  
  {
    "sentiment": "positive" | "negative" | "neutral",
    "sentimentScore": number between -1.0 and 1.0,
    "behavior": "brief summary of user's intent or tone (10–20 words)",
  }
  
  Guidelines:
  - Use "sentimentScore" to show emotion strength (-1.0 = very negative, 1.0 = very positive).
  - "behavior" should briefly describe the tone or purpose of the tweet.
  - Only include "potentialIssues" if there’s something harmful or concerning.
  - Do NOT include markdown, code blocks, or extra text — only the JSON.
  
  Special rules:
  - Sarcasm = negative sentiment.
  - Emojis affect the sentiment score.
  - Cultural references can be mentioned in "behavior".
  - Flag hate speech, threats, or sensitive content in "potentialIssues".
  
  Tweet to analyze:
  "Can't believe JavaScript's map() function doesn't change the original array 😍🔥 #DevLife #JavaScript"`
    }]
};


export const generateResult = async (prompt) => {
    try {

        const systemInstruction = sentimentAnalysisInstruction;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction,
        });

        const generationConfig = {
            temperature: 0.2, // lower temp = more predictable/structured
            responseMimeType: "application/json", // Hints response should be JSON (note: not strictly enforced yet)
        };

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig
        });

        const responseText = await result.response.text();

        // Clean and parse response
        const cleaned = responseText.replace(/```json|```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
            console.log("Parsed JSON:", parsed);
        } catch (err) {
            console.error("Invalid JSON:", cleaned);
            throw new Error("Failed to parse JSON response from Gemini");
        }

        return parsed || "No content generated.";
    } catch (error) {
        console.error("Error in generateResult:", {
            message: error.message,
            status: error.status,
            stack: error.stack,
        });

        if (error.status === 500 || error.status === 503) {
            throw new Error("The service is temporarily unavailable. Please try again later.");
        } else if (error.status === 400) {
            throw new Error("Invalid request. Please check your prompt and try again.");
        } else {
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }
};
