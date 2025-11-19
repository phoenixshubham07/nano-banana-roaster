const jimp = require('jimp');

async function run() {
    try {
        const image = await new jimp(800, 600, '#ffffff');
        const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
        image.print(font, 50, 50, "This is a test meme.", 700);

        const outputPath = 'test-meme.png';
        await image.writeAsync(outputPath);
        console.log(`Image created successfully: ${outputPath}`);
    } catch (error) {
        console.error("Error creating image:", error);
    }
}

run();
