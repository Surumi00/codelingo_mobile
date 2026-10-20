import { StyleSheet } from "react-native";

import { colors, fontSizes, radii, spacing } from "@/theme";

export const diagnosticStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 620,
    gap: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
  },
  stateCard: {
    width: "100%",
    maxWidth: 620,
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
  },
  stateTitle: {
    color: colors.textStrong,
    fontSize: fontSizes.xxl,
    fontWeight: "700",
    textAlign: "center",
  },
  stateText: {
    color: colors.text,
    fontSize: fontSizes.lg,
    textAlign: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    overflow: "hidden",
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  progressFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: radii.pill,
  },
  progressLabel: {
    color: colors.text,
    fontSize: fontSizes.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  body: {
    gap: spacing.lg,
  },
  topic: {
    color: colors.accentSoft,
    fontSize: fontSizes.sm,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  question: {
    color: colors.textStrong,
    fontSize: fontSizes.xxl,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  options: {
    gap: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 62,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
  },
  optionSelected: {
    borderColor: colors.accentSoft,
  },
  optionIndicator: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.text,
    borderRadius: radii.pill,
  },
  optionIndicatorSelected: {
    borderColor: colors.accentSoft,
  },
  optionIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
  },
  optionLabel: {
    flex: 1,
    color: colors.textStrong,
    fontSize: fontSizes.lg,
    fontWeight: "600",
  },
  formError: {
    color: colors.danger,
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  actionBack: {
    flex: 1,
  },
  actionPrimary: {
    flex: 1.2,
  },
});
