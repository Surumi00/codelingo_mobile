import { StyleSheet } from "react-native";

import { colors, fontSizes, radii, spacing } from "@/theme";

export const diagnosticResultsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    alignItems: "center",
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  shell: {
    width: "100%",
    maxWidth: 1040,
    gap: spacing.lg,
  },
  stateCard: {
    width: "100%",
    maxWidth: 620,
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  stateTitle: {
    color: colors.textStrong,
    fontSize: fontSizes.xxxl,
    fontWeight: "700",
    textAlign: "center",
  },
  stateText: {
    color: colors.text,
    fontSize: fontSizes.lg,
    lineHeight: 24,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  heading: {
    gap: spacing.sm,
  },
  kicker: {
    color: colors.accentSoft,
    fontSize: fontSizes.xs,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: colors.textStrong,
    fontSize: fontSizes.xxxl,
    fontWeight: "700",
  },
  hero: {
    gap: spacing.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    borderRadius: radii.md,
  },
  scoreBlock: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: fontSizes.xs,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  score: {
    color: colors.textStrong,
    fontSize: 52,
    fontWeight: "700",
    lineHeight: 56,
  },
  scoreTotal: {
    color: colors.text,
    fontSize: fontSizes.xxxl,
    fontWeight: "700",
  },
  percentage: {
    color: colors.accentSoft,
    fontSize: fontSizes.xl,
    fontWeight: "800",
  },
  placementBlock: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
  },
  levelBadge: {
    alignSelf: "flex-start",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.pill,
    backgroundColor: colors.accentMuted,
  },
  levelBadgeText: {
    color: colors.accentSoft,
    fontSize: fontSizes.xl,
    fontWeight: "800",
  },
  placementNote: {
    color: colors.text,
    fontSize: fontSizes.md,
  },
  placementNoteStrong: {
    color: colors.textStrong,
    fontWeight: "700",
  },
  detailBlock: {
    gap: spacing.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  detailTitle: {
    color: colors.textStrong,
    fontSize: fontSizes.lg,
    fontWeight: "800",
  },
  reviewText: {
    color: colors.textStrong,
    fontSize: fontSizes.lg,
    lineHeight: 27,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    minHeight: 46,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  breakdownRowLast: {
    borderBottomWidth: 0,
  },
  breakdownLabel: {
    flexShrink: 1,
    color: colors.textStrong,
    fontSize: fontSizes.lg,
  },
  breakdownValue: {
    color: colors.accentSoft,
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
});
