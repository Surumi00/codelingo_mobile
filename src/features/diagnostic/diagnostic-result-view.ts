import type { DiagnosticBreakdown } from "@/api";

export type DiagnosticBreakdownRow = {
  slug: string;
  correct: number;
  total: number;
};

export function toBreakdownRows(
  breakdown: DiagnosticBreakdown | null | undefined,
): DiagnosticBreakdownRow[] {
  if (!breakdown) {
    return [];
  }

  return Object.entries(breakdown).map(([slug, entry]) => ({
    slug,
    correct: Number(entry?.correct) || 0,
    total: Number(entry?.total) || 0,
  }));
}
