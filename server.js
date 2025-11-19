const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const jimp = require('jimp');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({ dest: 'uploads/' });

require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.LLM_API_KEY) {
    console.error("LLM_API_KEY not found in .env file. Please make sure to set it.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);

async function getRoasts(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest"});
        const prompt = `You are Nano Banana, a witty and sarcastic AI that roasts resumes and startup ideas.

        1.  First, identify the single most "roastable" part of the following text. This could be a funny phrase, a buzzword, a cliche, or anything that stands out as particularly mockable.
        2.  Then, write a witty and sarcastic roast for that specific part.
        3.  Return the result as a single string, with the "roastable" part and the roast separated by a pipe character (|).
        
        For example:
        "Synergizing blockchain solutions"|Your "synergized blockchain solution" is just a glorified spreadsheet.
        
        Here is the text to roast:
        
        ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const roasts = await response.text();
        return roasts;
    } catch (error) {
        console.error("Full error object:", JSON.stringify(error, null, 2));
        console.error("Error calling LLM API:", error.message);
        return "I'm sorry, my brain is a little fried right now. I can't think of a good roast. Please try again later.";
    }
}

async function createMeme(roast) {
    try {
        const [bestThing, roastText] = roast.split('|');

        const image = await new jimp(1200, 675, '#000000');
        const whiteBox = await new jimp(1000, 400, '#ffffff');
        image.composite(whiteBox, 100, 50);

        const bestThingFont = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
        const roastFont = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);

        image.print(bestThingFont, 150, 150, bestThing, 900);
        image.print(roastFont, 100, 500, roastText, 1000);

        const memePath = `uploads/meme-${Date.now()}.png`;
        await image.writeAsync(memePath);
        return memePath;
    } catch (error) {
        console.error("Error creating image:", error);
        throw error;
    }
}

app.post('/roast', upload.single('resume'), async (req, res) => {
    const resumeFile = req.file;

    if (!resumeFile) {
        res.status(400).send('Please provide a resume to roast.');
        return;
    }

    try {
        let text;
        if (resumeFile.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(resumeFile.path);
            const data = await pdf(dataBuffer);
            text = data.text;
        } else if (resumeFile.mimetype === 'text/html') {
            const dataBuffer = fs.readFileSync(resumeFile.path, 'utf8');
            const $ = cheerio.load(dataBuffer);
            text = $('body').text();
        } else {
            res.status(400).send('Unsupported file type. Please upload a PDF or HTML file.');
            return;
        }

        const roasts = await getRoasts(text);
        const memePath = await createMeme(roasts);
        res.json({ imageUrl: `/${memePath}` });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send("An error occurred while creating the roast.");
    } finally {
        // Clean up the uploaded file
        fs.unlinkSync(resumeFile.path);
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
