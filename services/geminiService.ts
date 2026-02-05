
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserPreferences, PhoneRecommendation, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getPhoneRecommendations(preferences: UserPreferences): Promise<PhoneRecommendation[]> {
  const prompt = `As a world-class smartphone consultant, suggest exactly 3 best mobile phones (models from late 2023-2025) that perfectly match these preferences:
  
  PREFERENCES:
  - Budget: $${preferences.minPrice} - $${preferences.maxPrice}
  - Brand: ${preferences.brandPreference || 'Any'}
  - Performance: ${preferences.processorPerformance} (Gaming: ${preferences.gamingPerformance})
  - Camera/Battery Priority: Camera ${preferences.cameraPriority}, Battery ${preferences.batteryPriority}
  - Technical: 5G ${preferences.support5G ? 'Required' : 'Optional'}, ${preferences.displayType} Display, ${preferences.audioQuality} Audio, ${preferences.buildQuality} Build.

  For each phone, return a detailed JSON object. Assign a "matchScore" from 0-100 based on how well it fits.
  Provide 3 pros and 2-3 cons. 
  Identify a "bestUseCase" like "The Multimedia Powerhouse" or "Value King".
  Include a realistic "buyLink" to a major retailer (simulated).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  brand: { type: Type.STRING },
                  priceEstimate: { type: Type.STRING },
                  display: { type: Type.STRING },
                  processor: { type: Type.STRING },
                  camera: { type: Type.STRING },
                  battery: { type: Type.STRING },
                  whyThisPhone: { type: Type.STRING },
                  keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                  bestUseCase: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  buyLink: { type: Type.STRING }
                },
                required: ["id", "name", "brand", "priceEstimate", "display", "processor", "camera", "battery", "whyThisPhone", "keyFeatures", "pros", "cons", "bestUseCase", "matchScore", "buyLink"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    const parsed: GeminiResponse = JSON.parse(response.text.trim());
    return parsed.recommendations.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Our AI consultant is analyzing market data. Please try again.");
  }
}

export function createAssistantChat(context: PhoneRecommendation[]): Chat {
  const contextText = context.map(p => `${p.name} (${p.brand}): ${p.whyThisPhone}. Pros: ${p.pros.join(', ')}. Cons: ${p.cons.join(', ')}.`).join('\n');
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a helpful smartphone assistant. The user just received these recommendations:\n${contextText}\nAnswer follow-up questions about these phones or help them choose between them. Be concise and technical.`,
    }
  });
}
