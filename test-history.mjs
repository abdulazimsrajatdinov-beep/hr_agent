import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGeminiHistory() {
  const key = process.env.GEMINI_API_KEY || "";
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const chat = model.startChat({
      history: [
        { role: 'model', parts: [{ text: 'Sálem!' }] }
      ]
    });
    
    console.log("Sending message...");
    const result = await chat.sendMessage("Men keldim");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

testGeminiHistory();
