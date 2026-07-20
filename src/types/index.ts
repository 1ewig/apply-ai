import type { SessionBlueprint } from "../agent/types";

export type ComparisonResult = SessionBlueprint;

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
