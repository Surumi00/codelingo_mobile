import { formatLevelLabel } from "@/features/syllabus";

import type { Diagnosis, DiagnosisConcept } from "./types";

export const DEFAULT_INSIGHT =
  "Your diagnostic is ready. We’ll use this to map the right next steps for your coding journey.";

export const languageOptions = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "Go",
];

export const radarAxisOrder = [
  {
    label: "Variables",
    aliases: ["variables", "variables & types", "variables and types"],
  },
  {
    label: "Loops",
    aliases: [
      "loops",
      "loops & control flow",
      "loops and control flow",
      "iteration",
    ],
  },
  {
    label: "Functions",
    aliases: ["functions", "functions & scope", "functions and scope"],
  },
  {
    label: "OOP",
    aliases: [
      "oop",
      "object-oriented programming",
      "object oriented programming",
      "class inheritance",
    ],
  },
  {
    label: "Data Struct.",
    aliases: [
      "data structures",
      "data struct.",
      "data structures & algorithms",
    ],
  },
  {
    label: "Exceptions",
    aliases: ["exceptions", "exception handling"],
  },
] as const;

export function getInitials(name: string) {
  const trimmed = name.trim();

  if (!trimmed) {
    return "AL";
  }

  return trimmed
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function normalizeConceptStatus(
  value: string,
): DiagnosisConcept["status"] {
  const normalized = value.toLowerCase();

  if (normalized === "strong") {
    return "Strong";
  }

  if (normalized === "developing") {
    return "Developing";
  }

  return "Weak";
}

export function clampConceptScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(5, Math.max(0, value));
}

export function getConceptStatusFromScore(
  score: number,
): DiagnosisConcept["status"] {
  if (score >= 4) {
    return "Strong";
  }

  if (score >= 2) {
    return "Developing";
  }

  return "Weak";
}

function getConceptScore(correct: unknown, total: unknown): number {
  const parsedTotal = Number(total);
  const parsedCorrect = Number(correct);

  if (!Number.isFinite(parsedTotal) || parsedTotal <= 0) {
    return 0;
  }

  if (!Number.isFinite(parsedCorrect)) {
    return 0;
  }

  return clampConceptScore(Math.round((parsedCorrect / parsedTotal) * 5));
}

function normalizeBreakdownConcepts(breakdown: unknown): DiagnosisConcept[] {
  if (!breakdown || typeof breakdown !== "object" || Array.isArray(breakdown)) {
    return [];
  }

  return Object.entries(breakdown as Record<string, unknown>).map(
    ([slug, entry]) => {
      const record =
        entry && typeof entry === "object"
          ? (entry as Record<string, unknown>)
          : {};
      const score = getConceptScore(record.correct, record.total);

      return {
        name: formatLevelLabel(slug),
        score,
        status: getConceptStatusFromScore(score),
      };
    },
  );
}

export function normalizeDiagnosis(raw: unknown): Diagnosis | null {
  if (!raw) {
    return null;
  }

  const source = raw as Record<string, unknown>;
  const payload = (source.result ?? source.diagnostic ?? source) as Record<
    string,
    unknown
  > | null;

  if (
    !payload ||
    (typeof payload === "object" && Object.keys(payload).length === 0)
  ) {
    return null;
  }

  const scoreText = String(payload.score ?? "");
  const parsedScore = Number(
    scoreText.includes("/")
      ? scoreText.split("/")[0].trim()
      : (payload.score ?? 0),
  );
  const parsedScoreTotal = Number(
    payload.scoreTotal ??
      payload.totalQuestions ??
      (scoreText.includes("/") ? scoreText.split("/")[1]?.trim() : 0),
  );

  const concepts = Array.isArray(payload.concepts)
    ? payload.concepts.map((concept: unknown, index: number) => {
        const entry = concept as Record<string, unknown> | null;
        const conceptName = String(
          entry?.name ?? radarAxisOrder[index % radarAxisOrder.length].label,
        );
        const conceptScore = Number(entry?.score ?? 0);
        const conceptStatus = normalizeConceptStatus(
          String(entry?.status ?? "Weak"),
        );

        return {
          name: conceptName,
          score: Number.isFinite(conceptScore) ? conceptScore : 0,
          status: conceptStatus,
        };
      })
    : normalizeBreakdownConcepts(payload.breakdown);

  return {
    score: Number.isFinite(parsedScore) ? parsedScore : 0,
    scoreTotal:
      Number.isFinite(parsedScoreTotal) && parsedScoreTotal > 0
        ? parsedScoreTotal
        : 15,
    questionsAnswered: Number(
      payload.questionsAnswered ??
        payload.questions ??
        payload.totalQuestions ??
        0,
    ),
    level: String(payload.level ?? "Beginner"),
    insight: String(payload.insight ?? payload.review ?? DEFAULT_INSIGHT),
    concepts,
  };
}
