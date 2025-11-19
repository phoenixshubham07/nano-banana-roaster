# Nano Banana Resume Roaster

## Project Description
This is a web application that takes a user's resume (as a PDF) and generates a witty roast of it using a large language model (Google Generative AI). The roast is then displayed as a "wait what" style meme.

## Setup and Running Instructions

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (Node Package Manager)

### Installation
1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd roaster
    ```
2.  **Install dependencies:**
    ```bash
    npm install express multer pdf-parse jimp@0.16.1 dotenv @google/generative-ai
    ```
3.  **Set up your Google Generative AI API Key:**
    *   Go to [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account.
    *   Generate a new API key.
    *   Create a `.env` file in the root directory of this project.
    *   Add your API key to the `.env` file in the following format:
        ```
        LLM_API_KEY="YOUR_API_KEY"
        ```
        Replace `"YOUR_API_KEY"` with the actual API key you generated.

### Running the Application
1.  **Start the server:**
    ```bash
    node server.js
    ```
2.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3000`.

## Current Project State

### UI Layout
*   **Title:** "Nano Banana Resume Roaster" displayed as an `<h1>` tag at the top of the page.
*   **Layout:** A single-column layout with the input card and the roast display area stacked vertically.
*   **Input Card:** Contains a paragraph description, a file input for PDF uploads, and a "Roast Me!" button.
*   **Roast Display Area:** Contains a heading "Your Roast Will Appear Here", a `div` for displaying the generated meme (`#roast-result`), a loading spinner (`#loader`), and a "Download Meme" button (`#download-button`).
*   **Background:** Dynamic animated background applied via `public/style.css`.

### Meme Generation Logic
*   **LLM Integration:** Uses Google Generative AI (`gemini-pro-latest` model) to generate roasts.
*   **Roast Prompt:** The LLM is instructed to identify the single most "roastable" part of the input text and generate a witty, sarcastic roast for it. The output format is `"ROASTABLE_THING"|ROAST_TEXT`.
*   **Image Creation:** Uses the `jimp` library to create a "wait what" style meme:
    *   A black background (1200x675 pixels).
    *   A white inner rectangle (1000x400 pixels) where the "roastable thing" is displayed.
    *   The "roastable thing" is printed in `jimp.FONT_SANS_64_BLACK`.
    *   The roast text is printed in the black frame area below the white rectangle, using `jimp.FONT_SANS_32_WHITE`.
*   **PDF Parsing:** Uses `pdf-parse` to extract text from uploaded PDF files.

## Known Issues / Future Plans
*   **Error Handling:** Improve error messages for better user feedback.
*   **Meme Customization:** Allow users to customize meme fonts, colors, or background images.
*   **LinkedIn/Website Scraping:** Implement actual scraping for LinkedIn profiles or websites (currently uses URL as text).
*   **Multiple Roasts:** Re-implement the ability to generate and display multiple roasts if desired.
*   **Font Choice:** Explore options for using custom fonts with `jimp` without encountering `BMFont` parsing issues.
*   **UI/UX:** Further refine the user interface and experience.
