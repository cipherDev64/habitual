import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

console.log("Processing chat request...");
const apiKey = process.env.GEMINI_API_KEY;

// Hardcoded fallback responses for demo purposes
const FALLBACK_RESPONSES: Record<string, string> = {
  "hi": "Hello! I am your Habitual assistant. How can I help you with your fitness journey today?",
  "hello": "Hello! Ready to crush your goals?",
  "diet": "A balanced diet is key! Focus on whole foods, plenty of protein, and staying hydrated. Try tracking your meals to see where you can improve.",
  "workout": "Consistency is king! Whether it's a 15-minute walk or a heavy lifting session, just showing up matters. What kind of workout are you planning?",
  "health": "Health is wealth. Remember to sleep well (7-9 hours), drink water, and move your body daily.",
  "tips": "Here are 3 quick tips: \n1. Drink a glass of water first thing in the morning.\n2. Prep your gym clothes the night before.\n3. focus on progress, not perfection.",
  "motivation": "You didn't come this far to only come this far. Keep going!",
  "protein": "Protein helps repair muscle. Good sources include chicken, fish, tofu, beans, and greek yogurt.",
  "cardio": "Cardio is great for your heart! Running, cycling, swimming, or even brisk walking count. Aim for at least 150 minutes a week.",
  "default": "I'm experiencing some connectivity issues with my brain, but remember: Small daily habits lead to massive long-term results! (Fallback Mode)"
};

const { messages } = await req.json();

if (!messages || !Array.isArray(messages)) {
  return NextResponse.json(
    { error: "Invalid messages format" },
    { status: 400 }
  );
}

const lastUserMessage = messages[messages.length - 1].content.toLowerCase();

// Check for keywords in the user's message to return a relevant hardcoded response
let fallbackContent = FALLBACK_RESPONSES["default"];
for (const [key, response] of Object.entries(FALLBACK_RESPONSES)) {
  if (lastUserMessage.includes(key)) {
    fallbackContent = response;
    break;
  }
}

// Attempt to use API if key exists, otherwise use fallback immediately
if (!apiKey) {
  console.warn("API Key missing, using fallback.");
  return NextResponse.json({ role: "assistant", content: fallbackContent });
}

try {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))
  });

  const result = await chat.sendMessage(messages[messages.length - 1].content);
  const response = await result.response;
  const text = response.text();
  return NextResponse.json({ role: "assistant", content: text });
} catch (apiError) {
  console.error("Gemini API Failed, switching to fallback:", apiError);
  return NextResponse.json({ role: "assistant", content: fallbackContent });
}
  } catch (error) {
  console.error("Critical Error in chat API:", error);
  // Even in critical error, try to return a polite JSON so the UI doesn't break
  return NextResponse.json({ role: "assistant", content: "I'm having trouble connecting right now, but stay consistent with your habits!" });
}
}
