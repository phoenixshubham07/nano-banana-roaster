require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
    if (!process.env.LLM_API_KEY) {
        console.error("LLM_API_KEY not found in .env file. Please make sure to set it.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
        const modelInfo = await genAI.getGenerativeModel({ model: "gemini-pro" }).listModels();
        
        console.log("Available Models:");
        for (const model of modelInfo) {
            console.log(model.name);
        }
    } catch (error) {
        console.error("Error listing models:", error.message);
    }
}

run();
