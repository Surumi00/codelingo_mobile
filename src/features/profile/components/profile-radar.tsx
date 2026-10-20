import { useWindowDimensions } from "react-native";
import { Circle, Line, Polygon, Svg, Text as SvgText } from "react-native-svg";

import {
  getRadarLabelPlacement,
  getRadarPoint,
  getRadarPolygonPoints,
  getRadarRadius,
  RADAR_ASPECT_RATIO,
  RADAR_CENTER,
  RADAR_GRID_SCALES,
  RADAR_MAX_RADIUS,
  RADAR_VIEW_BOX,
  resolveRadarAxes,
  type DiagnosisConcept,
} from "@/features/profile";
import { colors } from "@/theme";

export type ProfileRadarProps = {
  concepts: DiagnosisConcept[];
};

const MAX_CHART_WIDTH = 320;
const MIN_CHART_WIDTH = 200;
const HORIZONTAL_MARGIN = 96;

export function ProfileRadar({ concepts }: ProfileRadarProps) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(
    Math.max(width - HORIZONTAL_MARGIN, MIN_CHART_WIDTH),
    MAX_CHART_WIDTH,
  );
  const axes = resolveRadarAxes(concepts);
  const radii = axes.map((axis) => getRadarRadius(axis.score));

  return (
    <Svg
      width={chartWidth}
      height={chartWidth * RADAR_ASPECT_RATIO}
      viewBox={RADAR_VIEW_BOX}
      accessibilityLabel="Skill radar showing strengths and development areas"
    >
      {RADAR_GRID_SCALES.map((scale) => (
        <Polygon
          key={scale}
          points={getRadarPolygonPoints(
            axes.map(() => getRadarRadius(scale * 5)),
          )}
          fill="none"
          stroke={colors.borderStrong}
          strokeWidth={1}
        />
      ))}

      {axes.map((axis, index) => {
        const end = getRadarPoint(index, RADAR_MAX_RADIUS);

        return (
          <Line
            key={axis.label}
            x1={RADAR_CENTER}
            y1={RADAR_CENTER}
            x2={end.x}
            y2={end.y}
            stroke={colors.border}
            strokeWidth={1}
          />
        );
      })}

      <Polygon
        points={getRadarPolygonPoints(radii)}
        fill={colors.accentMuted}
        stroke={colors.accent}
        strokeWidth={2}
      />

      {radii.map((radius, index) => {
        const point = getRadarPoint(index, radius);

        return (
          <Circle
            key={axes[index].label}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={colors.accentSoft}
            stroke={colors.accent}
            strokeWidth={2}
          />
        );
      })}

      {axes.map((axis, index) => {
        const label = getRadarLabelPlacement(index);

        return (
          <SvgText
            key={axis.label}
            x={label.x}
            y={label.y}
            fill={colors.text}
            fontSize={11}
            textAnchor={label.anchor}
          >
            {axis.label}
          </SvgText>
        );
      })}
    </Svg>
  );
}
