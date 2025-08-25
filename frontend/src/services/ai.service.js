import axios from 'axios';

export const getGeminiAlternatives = async (foodType) => {
  try {
    // Define the prompt for Gemini AI
    const prompt = `Give 2 creative and eco-friendly alternative uses for leftover ${foodType}. Present the answer as a bullet point list.`;

    // Update to the correct endpoint and structure the request body correctly
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', // Updated endpoint
      {
        // Adjusted the structure for content as per Gemini API
        input: {
          instances: [
            { prompt: prompt } // The prompt to send to Gemini
          ]
        }
      },
      {
        params: {
          key: 'AIzaSyCinS4QMs3i3Uba0xiON0A4hh2Z9b16nWA' // Keep the API key here as a query parameter
        }
      }
    );

    // Extract text from the response if available
    const text = response.data.predictions?.[0]?.generated_text || '';

    // Return the bullet points
    return text.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'));
  } catch (err) {
    console.error(`Gemini AI Error for ${foodType}:`, err);
    return null;
  }
};
