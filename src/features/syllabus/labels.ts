import type { SyllabusTopic } from "./types";

export function normalizeComparableValue(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatLevelLabel(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(
      (segment) =>
        segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase(),
    )
    .join(" ");
}

export function getTopicGlyph(topic: SyllabusTopic) {
  const text = (topic.name ?? topic.title ?? topic.slug ?? "").toLowerCase();

  if (text.includes("exception") || text.includes("error")) {
    return "⚠";
  }

  if (
    text.includes("database") ||
    text.includes("api") ||
    text.includes("file")
  ) {
    return "▣";
  }

  if (text.includes("function") || text.includes("math")) {
    return "ƒ";
  }

  if (text.includes("object") || text.includes("class")) {
    return "◫";
  }

  if (text.includes("project") || text.includes("build")) {
    return "◈";
  }

  if (text.includes("library") || text.includes("module")) {
    return "▤";
  }

  return "⌘";
}
