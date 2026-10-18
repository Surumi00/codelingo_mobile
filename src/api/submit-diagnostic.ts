import { client } from "./client";
import type { SkillLevel } from "./types";

export type DiagnosticAnswer = {
  questionId: number;
  selectedOptionIndex: number;
};

export type SubmitDiagnosticRequest = {
  answers: DiagnosticAnswer[];
};

export type DiagnosticBreakdownEntry = {
  correct: number;
  total: number;
};

export type DiagnosticBreakdown = Record<string, DiagnosticBreakdownEntry>;

export type DiagnosticStartingLevel = {
  id: string;
  title: string;
};

export type DiagnosticSubmitResponse = {
  score: number;
  totalQuestions: number;
  percentage: number;
  level: SkillLevel;
  review: string;
  startingSyllabusLevel: DiagnosticStartingLevel;
  breakdown: DiagnosticBreakdown;
};

export async function submitDiagnostic(
  payload: SubmitDiagnosticRequest,
): Promise<DiagnosticSubmitResponse> {
  const { data } = await client.post<DiagnosticSubmitResponse>(
    "/diagnostic/submit",
    payload,
  );

  return data;
}
