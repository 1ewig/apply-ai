export interface ComparisonResult {
  score: number;
  fitLevel: string;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  gaps: string[];
  suggestions: {
    section: string;
    original: string;
    suggested: string;
    rationale: string;
  }[];
  interviewPrep: {
    question: string;
    strategy: string;
  }[];
}

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
}

export interface Resume {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  updatedAt: string;
}
