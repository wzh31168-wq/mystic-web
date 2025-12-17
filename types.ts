export enum Gender {
  MALE = '男',
  FEMALE = '女'
}

export enum PlanLevel {
  FREE = 'FREE',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM'
}

export interface UserData {
  name: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthPlace: string;
  inquiryContent?: string; // New field: The general topic or question for the divination
  customQuestion?: string; // For premium additional specific question
}

export interface FortuneResult {
  fullText: string;
  plan: PlanLevel;
  timestamp: number;
}

export interface PricingTier {
  id: PlanLevel;
  name: string;
  price: string;
  priceUSD: number;
  features: string[];
  recommended?: boolean;
}
