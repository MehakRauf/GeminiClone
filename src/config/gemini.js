/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = "AIzaSyD0-eW0rMwBicpNtIlaJuEeTCS0TUoFDlk";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// async function run(prompt) {
//     const chatSession = model.startChat({
//         generationConfig,
//         // safetySettings: Adjust safety settings
//         // See https://ai.google.dev/gemini-api/docs/safety-settings
//         history: [
//         ],
//     });

//     const result = await chatSession.sendMessage(prompt);
//     console.log(result.response.text());
//     return result.response.text();
// }

async function run(prompt) {
    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    try {
        const result = await chatSession.sendMessage(prompt);
        console.log(result.response.text());
        return result.response.text();
    } catch (error) {
        if (error.response && error.response.status === 429) {
            // Handle rate limit error
            console.error('Rate limit exceeded. Please try again later.');
            // Optionally implement retry logic with delay
            await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds
            return run(prompt); // Retry
        } else {
            // Handle other errors
            console.error('An error occurred:', error);
            throw error;
        }
    }
}


export default run;