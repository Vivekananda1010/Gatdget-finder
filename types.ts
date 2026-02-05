
export enum PriorityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum GamingLevel {
  CASUAL = 'CASUAL',
  MID = 'MID',
  HEAVY = 'HEAVY'
}

export enum ProcessorLevel {
  BASIC = 'BASIC',
  BALANCED = 'BALANCED',
  FLAGSHIP = 'FLAGSHIP'
}

export enum DisplayType {
  LCD = 'LCD',
  AMOLED = 'AMOLED',
  HIGH_REFRESH = 'HIGH_REFRESH'
}

export enum AudioType {
  NORMAL = 'NORMAL',
  STEREO = 'STEREO'
}

export enum BuildMaterial {
  PLASTIC = 'PLASTIC',
  METAL = 'METAL',
  GLASS = 'GLASS'
}

export enum UserKnowledgeLevel {
  CASUAL = 'CASUAL',
  EXPERT = 'EXPERT'
}

export interface UserPreferences {
  knowledgeLevel: UserKnowledgeLevel;
  maxPrice: number;
  currency: string;
  country: string;
  unlimitedBudget: boolean;
  prioritizePremium: boolean;
  cameraPriority: PriorityLevel;
  batteryPriority: PriorityLevel;
  gamingPerformance: GamingLevel;
  brandPreference: string;
  processorPerformance: ProcessorLevel;
  minRamStorage: string;
  support5G: boolean;
  displayType: DisplayType;
  audioQuality: AudioType;
  buildQuality: BuildMaterial;
  updatesImportance: PriorityLevel;
  simpleGoals: string[]; // Updated to array for multiple selections
}

export interface Retailer {
  name: string;
  url: string;
}

export interface PhoneRecommendation {
  id: string;
  name: string;
  brand: string;
  priceEstimate: string;
  display: string;
  processor: string;
  camera: string;
  battery: string;
  whyThisPhone: string;
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  bestUseCase: string;
  matchScore: number;
  availableRetailers: Retailer[];
}

export interface GeminiResponse {
  recommendations: PhoneRecommendation[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
