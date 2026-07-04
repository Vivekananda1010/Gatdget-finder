
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserPreferences, PhoneRecommendation, GeminiResponse, ProductCategory } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function getPhoneRecommendations(preferences: UserPreferences): Promise<PhoneRecommendation[]> {
  const isEarbuds = preferences.category === ProductCategory.EARBUDS;
  let prompt = "";

  if (isEarbuds) {
    const budgetInstruction = preferences.unlimitedBudget 
      ? "The user has an UNLIMITED BUDGET. Completely ignore the price constraints and suggest the absolute best, most premium wireless earbuds available in the market (e.g., Sony WF-1000XM5, Bose QuietComfort Ultra, Apple AirPods Pro 2, Sennheiser Momentum True Wireless 4, Devialet Gemini II). Focus on maximum acoustic capability, advanced audio codecs, and active noise cancelling."
      : `Suggest wireless earbuds within the budget of up to ${preferences.maxPrice} ${preferences.currency}.`;

    const premiumInstruction = (preferences.prioritizePremium || preferences.unlimitedBudget)
      ? "IMPORTANT: Prioritize ultra-premium audio devices that offer maximum sound resolution, custom EQ tuning, and industry-leading ANC."
      : "Focus on providing the best overall value within the user's requirements.";

    // Simple vs Expert earbuds preference mapping
    const technicalContext = preferences.knowledgeLevel === 'EXPERT'
      ? `- Active Noise Cancelling (ANC) Importance: ${preferences.ancPriority || 'MEDIUM'}
         - Sound Signature Preference: ${preferences.soundProfile || 'Balanced'}
         - Form Factor / Fit Style: ${preferences.fitType || 'In-Ear'}
         - Water / Dust Resistance Rating (IPX): ${preferences.waterResistance || 'MEDIUM'} importance
         - Audio Codecs / Quality Preference: ${preferences.codecPreference || 'Standard (SBC/AAC)'}`
      : `- Primary Listening Goals: ${preferences.simpleGoals.length > 0 ? preferences.simpleGoals.join(', ') : 'General Listening'}
         - The user is a casual consumer. Interpret these goals into technical requirements (e.g. "Work/Calls" means advanced mic array and voice isolation, "Sports" means high water resistance and a secure lock-in fit, "Audiophile" means support for high-res codecs like LDAC and dual dynamic/planar magnetic drivers).`;

    prompt = `As a world-class headphone and audiophile consultant, suggest a COMPREHENSIVE LIST of all relevant high-quality wireless earbuds (models from late 2023-2025) that match these preferences. Suggest all models that would be a good fit for the user's specific needs.

    PREFERENCES:
    - Budget Context: ${budgetInstruction}
    - Region: ${preferences.country}
    - Brand Preference: ${preferences.brandPreference || 'Any'}
    ${technicalContext}

    ${premiumInstruction}

    For each set of earbuds, return a detailed JSON object. Ensure the "priceEstimate" field matches the local pricing in ${preferences.country} using the currency ${preferences.currency}.
    Assign a "matchScore" (0-100) based on how well it fits the goals. Provide 3 pros and 2-3 cons. 
    Identify a "bestUseCase" like "The Audiophile Haven" or "The Commuter's Sanctuary".
    
    CRITICAL SCHEMA MAPPING: Since the output schema has fixed keys, you MUST map the earbud specifications to these fields exactly:
    - "display": Sound & Drivers description (e.g. "11mm Dynamic Driver + Knowles Balanced Armature, 24-bit audio")
    - "processor": Active Noise Cancellation description (e.g. "Hybrid Active Noise Cancelling up to 50dB with Custom Fit Calibration")
    - "camera": Battery & Case description (e.g. "8 hours play time, 30 hours total with Qi Wireless Charging Case")
    - "battery": Waterproof & Fit description (e.g. "IPX7 waterproof rating, secure oval silicone tips, sport wingfins")
    - "whyThisPhone": Explain why these specific earbuds are a perfect match for the user's audio profile.

    Do not limit yourself to 3; suggest all models that would be a good fit for the user's specific needs.`;
  } else {
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

    prompt = `As a world-class smartphone consultant, suggest a COMPREHENSIVE LIST of all relevant mobile phones (models from late 2023-2025) that match these preferences. Do not limit yourself to 3; suggest all models that would be a good fit for the user's specific needs.

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
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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

export function createAssistantChat(context: PhoneRecommendation[], category: ProductCategory): Chat {
  const isEarbuds = category === ProductCategory.EARBUDS;
  const contextText = context.map(p => `${p.name} (${p.brand}): ${p.whyThisPhone}. Pros: ${p.pros.join(', ')}. Cons: ${p.cons.join(', ')}. Availability: ${p.availableRetailers.map(r => r.name).join(', ')}.`).join('\n');
  
  const systemInstruction = isEarbuds
    ? `You are a helpful wireless earbuds and audio tech assistant. The user just received these recommendations:\n${contextText}\nAnswer follow-up questions about these earbuds (sound quality, noise cancellation, battery life, IPX water rating, fits, features) or help them choose between them. Mention where they can buy them if asked. Be concise, technical, and helpful.`
    : `You are a helpful smartphone assistant. The user just received these recommendations:\n${contextText}\nAnswer follow-up questions about these phones (display, performance, camera, battery, etc.) or help them choose between them. Mention where they can buy them if asked. Be concise, technical, and helpful.`;

  return ai.chats.create({
    model: 'gemini-3.5-flash',
    config: {
      systemInstruction,
    }
  });
}
