import { normalizeComparableValue } from "./labels";
import type {
  DiagnosticLikeResult,
  DiagnosticStartingLevel,
  SyllabusLevel,
} from "./types";

export function getDiagnosticStartingLevelText(
  result: DiagnosticLikeResult | null | undefined,
): string | null {
  if (!result) {
    return null;
  }

  const startingLevel: DiagnosticStartingLevel | undefined =
    result.startingSyllabusLevel;

  if (typeof startingLevel === "string") {
    return startingLevel.trim() || null;
  }

  if (startingLevel && typeof startingLevel === "object") {
    return typeof startingLevel.title === "string" && startingLevel.title.trim()
      ? startingLevel.title.trim()
      : null;
  }

  return null;
}

export function getDiagnosticLevelText(
  result: DiagnosticLikeResult | null | undefined,
): string | null {
  const startingLevelText = getDiagnosticStartingLevelText(result);

  if (startingLevelText) {
    return startingLevelText;
  }

  if (typeof result?.level === "string" && result.level.trim()) {
    return result.level.trim();
  }

  return null;
}

export function resolveRecommendedLevelIndex(
  levels: SyllabusLevel[],
  result: DiagnosticLikeResult | null | undefined,
): number {
  if (levels.length === 0) {
    return -1;
  }

  const startingLevel = result?.startingSyllabusLevel;
  const startingLevelId =
    startingLevel && typeof startingLevel === "object"
      ? startingLevel.id
      : undefined;

  if (startingLevelId !== undefined && startingLevelId !== null) {
    const idMatch = levels.findIndex(
      (level) => String(level.id) === String(startingLevelId),
    );

    if (idMatch >= 0) {
      return idMatch;
    }
  }

  const target = normalizeComparableValue(getDiagnosticLevelText(result));

  if (target.length > 0) {
    const textMatch = levels.findIndex((level) => {
      return (
        normalizeComparableValue(level.name) === target ||
        normalizeComparableValue(level.title) === target ||
        normalizeComparableValue(level.description) === target ||
        String(level.id).toLowerCase() === target
      );
    });

    if (textMatch >= 0) {
      return textMatch;
    }
  }

  return 0;
}
