export type ProfileData = {
  name: string;
  email: string;
  language: string;
};

export type DiagnosisConcept = {
  name: string;
  score: number;
  status: "Strong" | "Developing" | "Weak";
};

export type Diagnosis = {
  score: number;
  scoreTotal: number;
  questionsAnswered: number;
  level: string;
  insight: string;
  concepts: DiagnosisConcept[];
};
