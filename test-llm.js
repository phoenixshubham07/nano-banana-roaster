require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
    if (!process.env.LLM_API_KEY) {
        console.error("LLM_API_KEY not found in .env file. Please make sure to set it.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest"});
        const prompt = "Write a one-sentence roast of a software engineer's resume.";
        
        console.log("Sending prompt to the LLM...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        
        console.log("LLM Response:", text);
    } catch (error) {
        console.error("Error calling LLM API:", error.message);
    }
}

run();
