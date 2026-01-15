import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

// Initialize only if key exists (handled in UI if missing)
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateAIResponse = async (
  history: Message[],
  prompt: string,
  onStream: (text: string) => void
): Promise<string> => {
  if (!GEMINI_API_KEY) throw new Error("API Key missing");

  try {
    const model = "gemini-3-flash-preview";
    
    // Format history for context
    const context = history
      .slice(-10) // Keep last 10 messages for context
      .map(m => `${m.senderName}: ${m.content}`)
      .join('\n');

    const fullPrompt = `
      You are participating in a group chat. 
      Context of the last few messages:
      ${context}
      
      User says: "${prompt}"
      
      Reply naturally, concisely, and helpfuly as a chat participant. 
      Do not repeat the user's name excessively.
    `;

    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: fullPrompt,
    });

    let fullText = "";
    for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
            fullText += text;
            onStream(fullText);
        }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to my brain right now.";
  }
};
