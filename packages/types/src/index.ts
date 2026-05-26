// ─── Common ───────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "instructor" | "student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export type QuestionType = "mcq" | "true_false" | "short_answer" | "essay";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type AssessmentStatus = "draft" | "published" | "archived";

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  explanation?: string;
  difficulty: DifficultyLevel;
  points: number;
  tags: string[];
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel?: string;
  questions: Question[];
  totalPoints: number;
  durationMinutes?: number;
  status: AssessmentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Job ──────────────────────────────────────────────────────────────────────

export type JobStatus = "waiting" | "active" | "completed" | "failed";

export interface GenerationJobData {
  userId: string;
  topic: string;
  subject: string;
  questionCount: number;
  difficulty: DifficultyLevel;
  questionTypes: QuestionType[];
}

export interface GenerationJob {
  id: string;
  status: JobStatus;
  progress: number;
  data: GenerationJobData;
  result?: Assessment;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
