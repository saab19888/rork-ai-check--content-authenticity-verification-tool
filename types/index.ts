export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number | null;
  features: string[];
  checksPerMonth: number;
  isFeatured?: boolean;
};

export type AnalysisResult = {
  id: string;
  title: string;
  date: string;
  classification: 'human' | 'ai' | 'mixed';
  confidenceScore: number;
  textLength: number;
  reasoning?: string;
  suspiciousSegments?: {
    text: string;
    startIndex: number;
    endIndex: number;
    score: number;
  }[];
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  subscription: {
    plan: string;
    expiresAt: string;
    checksRemaining: number;
  };
};