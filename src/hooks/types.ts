import type {
  ComparisonResult,
  EnhancedKeyword,
  ScoreBreakdown,
  StructureSuggestion,
  SkillRecommendation,
  ActionItem,
  AtsCheck,
} from "../ai/schemas";

export type {
  ComparisonResult,
  EnhancedKeyword,
  ScoreBreakdown,
  StructureSuggestion,
  SkillRecommendation,
  ActionItem,
  AtsCheck,
};

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  dateApplied: string;
  url?: string;
  jobDescription?: string;
  matchScore?: number;
  analysisResult?: ComparisonResult;
  resumeUsed?: string;
  customResumeContent?: string;
}

export interface Resume {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  updatedAt: string;
}
