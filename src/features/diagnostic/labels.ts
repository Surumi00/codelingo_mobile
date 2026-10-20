export function formatConceptLabel(conceptSlug: string) {
  return conceptSlug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}
