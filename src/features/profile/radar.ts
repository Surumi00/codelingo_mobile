import { clampConceptScore, radarAxisOrder } from "./profile-helpers";
import type { DiagnosisConcept } from "./types";

export type RadarAxisValue = {
  label: string;
  score: number;
};

export type RadarPoint = {
  x: number;
  y: number;
};

export type RadarLabelAnchor = "middle" | "start" | "end";

export const RADAR_GRID_SCALES = [0.25, 0.5, 0.75, 1] as const;
export const RADAR_MIN_RADIUS = 40;
export const RADAR_MAX_RADIUS = 130;
export const RADAR_LABEL_RADIUS = 150;
export const RADAR_CENTER = 150;
export const RADAR_VIEW_BOX = "-70 -24 440 348";
export const RADAR_ASPECT_RATIO = 348 / 440;

const LABEL_ANCHORS: RadarLabelAnchor[] = [
  "middle",
  "start",
  "start",
  "middle",
  "end",
  "end",
];

function normalizeRadarValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesRadarAlias(name: string, alias: string): boolean {
  const normalizedName = normalizeRadarValue(name);
  const normalizedAlias = normalizeRadarValue(alias);

  if (!normalizedName || !normalizedAlias) {
    return false;
  }

  return (
    normalizedName === normalizedAlias ||
    normalizedName.startsWith(`${normalizedAlias} `) ||
    normalizedName.endsWith(` ${normalizedAlias}`) ||
    normalizedName.includes(` ${normalizedAlias} `)
  );
}

export function resolveRadarAxes(
  concepts: DiagnosisConcept[],
): RadarAxisValue[] {
  return radarAxisOrder.map((axis) => {
    const matched = concepts.find((concept) =>
      axis.aliases.some((alias) => matchesRadarAlias(concept.name, alias)),
    );
    const exact = concepts.find(
      (concept) =>
        normalizeRadarValue(concept.name) === normalizeRadarValue(axis.label),
    );

    return {
      label: axis.label,
      score: clampConceptScore(matched?.score ?? exact?.score ?? 0),
    };
  });
}

export function getRadarRadius(score: number): number {
  const range = RADAR_MAX_RADIUS - RADAR_MIN_RADIUS;

  return RADAR_MIN_RADIUS + (clampConceptScore(score) / 5) * range;
}

export function getRadarPoint(index: number, radius: number): RadarPoint {
  const angle = (-90 + index * 60) * (Math.PI / 180);

  return {
    x: RADAR_CENTER + Math.cos(angle) * radius,
    y: RADAR_CENTER + Math.sin(angle) * radius,
  };
}

export function getRadarPolygonPoints(radii: number[]): string {
  return radii
    .map((radius, index) => {
      const point = getRadarPoint(index, radius);

      return `${point.x},${point.y}`;
    })
    .join(" ");
}

export function getRadarLabelPlacement(
  index: number,
): RadarPoint & { anchor: RadarLabelAnchor } {
  const point = getRadarPoint(index, RADAR_LABEL_RADIUS);

  return {
    x: point.x,
    y: point.y,
    anchor: LABEL_ANCHORS[index % LABEL_ANCHORS.length],
  };
}
