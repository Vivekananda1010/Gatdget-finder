
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, PhoneRecommendation, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getPhoneRecommendations(preferences: UserPreferences): Promise<PhoneRecommendation[]> {
  const prompt = `As a world-class smartphone consultant, suggest 3-5 best mobile phones (models from 2023-2025) for a user with these detailed preferences:
  
  CORE PREFERENCES:
  - Budget Range: $${preferences.minPrice} to $${preferences.maxPrice}
  - Brand Preference: ${preferences.brandPreference || 'No specific preference'}
  - Camera Importance: ${preferences.cameraPriority}
  - Battery/Charging Needs: ${preferences.batteryPriority}
  - Software Updates Importance: ${preferences.updatesImportance}

  TECHNICAL SPECS:
  - Processor Performance: ${preferences.processorPerformance}
  - Gaming Needs: ${preferences.gamingPerformance}
  - Minimum RAM/Storage: ${preferences.minRamStorage}
  - 5G Support Required: ${preferences.support5G ? 'Yes' : 'No'}
  - Preferred Display: ${preferences.displayType}
  - Audio Quality: ${preferences.audioQuality} (Stereo/Normal)
  - Preferred Build: ${preferences.buildQuality}

  Analyze these constraints and provide specific reasoning for how each recommendation satisfies these requirements.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
                  keyFeatures: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["id", "name", "brand", "priceEstimate", "display", "processor", "camera", "battery", "whyThisPhone", "keyFeatures"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    const jsonStr = response.text.trim();
    const parsed: GeminiResponse = JSON.parse(jsonStr);
    return parsed.recommendations;
  } catch (error) {
    console.error("Error fetching phone recommendations:", error);
    throw new Error("Our AI consultant is busy. Please try again in a moment.");
  }
}
