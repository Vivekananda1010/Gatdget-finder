
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserPreferences, PhoneRecommendation, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getPhoneRecommendations(preferences: UserPreferences): Promise<PhoneRecommendation[]> {
  const budgetInstruction = preferences.unlimitedBudget 
    ? "The user has an UNLIMITED BUDGET. Completely ignore the price constraints and suggest the absolute best, most premium flagship smartphones available in the market (e.g., iPhone 16 Pro Max, Samsung S24 Ultra, Pixel 9 Pro XL). Focus on maximum hardware capability."
    : `Suggest phones within the budget of up to ${preferences.maxPrice} ${preferences.currency}.`;

  const premiumInstruction = (preferences.prioritizePremium || preferences.unlimitedBudget)
    ? "IMPORTANT: Prioritize ultra-premium devices that offer the maximum possible performance and features."
    : "Focus on providing the best overall value within the user's requirements.";

  // Handle Gaming Cooling Logic
  const coolingRequirement = (preferences.knowledgeLevel === 'EXPERT' && preferences.gamingPerformance === 'HEAVY') || 
                            (preferences.knowledgeLevel === 'CASUAL' && preferences.simpleGoals.includes('Gaming'))
    ? "FOR GAMING: The user is a heavy gamer. You MUST prioritize phones with advanced thermal management systems (Vapor Chambers, graphene sheets, or active cooling) to prevent thermal throttling and ensure sustained flagship performance."
    : "";

  // Handle Casual vs Expert Logic in the prompt
  const technicalContext = preferences.knowledgeLevel === 'EXPERT' 
    ? `- Performance Level: ${preferences.processorPerformance} (Gaming Profile: ${preferences.gamingPerformance})
       - Camera/Battery Priority: Camera ${preferences.cameraPriority}, Battery ${preferences.batteryPriority}
       - Technical Specs: 5G ${preferences.support5G ? 'Required' : 'Optional'}, ${preferences.displayType} Display, ${preferences.audioQuality} Audio, ${preferences.buildQuality} Build.`
    : `- Primary Goals: ${preferences.simpleGoals.length > 0 ? preferences.simpleGoals.join(', ') : 'General Usage'}
       - The user is a casual consumer. Interpret these goals into technical requirements (e.g. "Photography" means high-end ISP/Sensors, "Work" means productivity features and battery).`;

  const prompt = `As a world-class smartphone consultant, suggest a COMPREHENSIVE LIST of all relevant mobile phones (models from late 2023-2025) that match these preferences. Do not limit yourself to 3; suggest all models that would be a good fit for the user's specific needs.

  PREFERENCES:
  - Budget Context: ${budgetInstruction}
  - Region: ${preferences.country}
  - Brand Preference: ${preferences.brandPreference || 'Any'}
  ${technicalContext}

  ${coolingRequirement}
  ${premiumInstruction}

  For each phone, return a detailed JSON object. Ensure the "priceEstimate" field matches the local pricing in ${preferences.country} using the currency ${preferences.currency}.
  Assign a "matchScore" (0-100). Provide 3 pros and 2-3 cons. 
  Identify a "bestUseCase" like "The Multimedia Powerhouse" or "The Productivity King".
  
  CRITICAL: List all major e-commerce platforms where this phone is commonly available in ${preferences.country}. 
  Provide realistic simulated URLs for each platform in the "availableRetailers" array.`;

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
                  availableRetailers: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        url: { type: Type.STRING }
                      },
                      required: ["name", "url"]
                    }
                  }
                },
                required: ["id", "name", "brand", "priceEstimate", "display", "processor", "camera", "battery", "whyThisPhone", "keyFeatures", "pros", "cons", "bestUseCase", "matchScore", "availableRetailers"]
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
  const contextText = context.map(p => `${p.name} (${p.brand}): ${p.whyThisPhone}. Pros: ${p.pros.join(', ')}. Cons: ${p.cons.join(', ')}. Availability: ${p.availableRetailers.map(r => r.name).join(', ')}.`).join('\n');
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a helpful smartphone assistant. The user just received these recommendations:\n${contextText}\nAnswer follow-up questions about these phones or help them choose between them. Mention where they can buy them if asked. Be concise and technical.`,
    }
  });
}
