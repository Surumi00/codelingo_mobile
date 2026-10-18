export type UserRole = "STUDENT" | "ADMIN";

export type Language = "PYTHON" | "JAVA" | "JAVASCRIPT";

export type SupportedLanguage = "PYTHON";

export type SkillLevel =
  "BEGINNER" | "ELEMENTARY" | "INTERMEDIATE" | "ADVANCED";

export type ExperienceLevel =
  "STUDENT" | "BEGINNER" | "SOME_EXPERIENCE" | "EXPERIENCED";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: Language | null;
  occupation: string | null;
  experienceLevel: ExperienceLevel | null;
  currentLevel: SkillLevel;
  xp: number;
  streakCount: number;
  lastActiveDate: string | null;
  placementReadinessScore: number;
  avatarUrl: string | null;
  portfolioSlug: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiErrorBody = {
  error: {
    message: string;
  };
};
