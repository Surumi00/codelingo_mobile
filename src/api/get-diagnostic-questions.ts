import { client } from "./client";

export type DiagnosticQuestion = {
  id: number;
  conceptSlug: string;
  difficulty: string;
  prompt: string;
  options: string[];
};

export type GetDiagnosticQuestionsResponse = {
  questions: DiagnosticQuestion[];
};

export async function getDiagnosticQuestions(): Promise<DiagnosticQuestion[]> {
  const { data } = await client.get<GetDiagnosticQuestionsResponse>(
    "/diagnostic/questions",
  );

  return data.questions;
}
