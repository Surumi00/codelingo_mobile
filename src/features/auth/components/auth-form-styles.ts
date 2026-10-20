import { StyleSheet } from "react-native";

import { colors, fontSizes, radii, spacing } from "@/theme";

export const authFormStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: spacing.lg,
    padding: spacing.xl,
  },
  hero: {
    alignItems: "center",
    gap: spacing.sm,
  },
  heroTitle: {
    marginTop: spacing.sm,
    color: colors.textStrong,
    fontSize: fontSizes.display,
    fontWeight: "800",
    lineHeight: 40,
    textAlign: "center",
  },
  heroCopy: {
    color: colors.text,
    fontSize: fontSizes.lg,
    lineHeight: 24,
    textAlign: "center",
  },
  card: {
    gap: spacing.lg,
  },
  heading: {
    color: colors.textStrong,
    fontSize: fontSizes.xxl,
    fontWeight: "700",
    textAlign: "center",
  },
  subheading: {
    color: colors.text,
    fontSize: fontSizes.md,
    textAlign: "center",
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
  input: {
    minHeight: 46,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    color: colors.textStrong,
    fontSize: fontSizes.lg,
  },
  inputError: {
    borderColor: colors.danger,
  },
  fieldError: {
    color: colors.danger,
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
  status: {
    color: colors.danger,
    fontSize: fontSizes.md,
    fontWeight: "700",
    textAlign: "center",
  },
  notice: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
  },
  noticeText: {
    color: colors.success,
    fontSize: fontSizes.md,
    fontWeight: "700",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
  },
  footerText: {
    color: colors.text,
    fontSize: fontSizes.md,
  },
  footerLink: {
    color: colors.accent,
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
});
