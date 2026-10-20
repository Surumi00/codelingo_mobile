import { StyleSheet } from "react-native";

import { colors, fontSizes, radii, spacing } from "@/theme";

export const profileStyles = StyleSheet.create({
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
    maxWidth: 720,
    gap: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
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
  heading: {
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: fontSizes.xs,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: colors.textStrong,
    fontSize: fontSizes.xxl,
    fontWeight: "700",
    lineHeight: 30,
  },
  titleAccent: {
    color: colors.accentSoft,
  },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    color: colors.textStrong,
    fontSize: fontSizes.xl,
    fontWeight: "700",
  },
  summary: {
    gap: spacing.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  summaryIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
  },
  avatarGradient: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  avatarText: {
    color: colors.onAccent,
    fontSize: fontSizes.xxl,
    fontWeight: "800",
  },
  identity: {
    flexShrink: 1,
    gap: spacing.sm,
  },
  identityName: {
    color: colors.textStrong,
    fontSize: fontSizes.xxl,
    fontWeight: "700",
  },
  identityEmail: {
    color: colors.text,
    fontSize: fontSizes.md,
  },
  levelTag: {
    alignSelf: "flex-start",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.accentMuted,
  },
  levelTagText: {
    color: colors.accentSoft,
    fontSize: fontSizes.xs,
    fontWeight: "700",
  },
  score: {
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  scoreValue: {
    color: colors.textStrong,
    fontSize: 34,
    fontWeight: "800",
  },
  scoreLabel: {
    color: colors.text,
    fontSize: fontSizes.xs,
  },
  rowList: {
    gap: 0,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowItemLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    color: colors.text,
    fontSize: fontSizes.sm,
  },
  rowValue: {
    flexShrink: 1,
    color: colors.textStrong,
    fontSize: fontSizes.sm,
    fontWeight: "700",
    textAlign: "right",
  },
  levelPill: {
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.accentMuted,
  },
  levelPillText: {
    color: colors.accentSoft,
    fontSize: fontSizes.xs,
    fontWeight: "700",
  },
  radarWrap: {
    alignItems: "center",
  },
  insightBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  insightMark: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  insightMarkText: {
    color: colors.onAccent,
    fontSize: fontSizes.lg,
    fontWeight: "800",
  },
  insightText: {
    flexShrink: 1,
    color: colors.text,
    fontSize: fontSizes.sm,
    lineHeight: 22,
  },
  breakdownSection: {
    gap: spacing.md,
  },
  conceptList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  conceptRow: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  conceptRowLast: {
    borderBottomWidth: 0,
  },
  conceptName: {
    color: colors.textStrong,
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
  conceptMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  progressDots: {
    flexDirection: "row",
    gap: 7,
  },
  dot: {
    width: 9,
    height: 9,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
  },
  dotFilled: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  statusTag: {
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.pill,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },
  pendingState: {
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  pendingTitle: {
    color: colors.textStrong,
    fontSize: fontSizes.xxl,
    fontWeight: "700",
  },
  pendingText: {
    color: colors.text,
    fontSize: fontSizes.md,
    lineHeight: 22,
    textAlign: "center",
  },
});
