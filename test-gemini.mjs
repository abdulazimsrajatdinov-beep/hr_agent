import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGemini() {
  const key = process.env.GEMINI_API_KEY || "";
  try {
    console.log("Initializing Gemini...");
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    console.log("Model initialized. Sending message...");
    const result = await model.generateContent("Sálem!");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

testGemini();
