const fs = require('fs');
const pdf = require('pdf-parse');

async function run() {
    const dataBuffer = fs.readFileSync('sample.pdf');
    try {
        const data = await pdf(dataBuffer);
        console.log("Extracted text:", data.text);
    } catch (error) {
        console.error("Error parsing PDF:", error);
    }
}

run();
