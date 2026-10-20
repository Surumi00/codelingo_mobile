import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSizes, spacing } from "@/theme";

export type PlaceholderScreenProps = {
  title?: string;
  caption?: string;
  children?: ReactNode;
};

export function PlaceholderScreen({
  title = "CodeLingo",
  caption = "Placeholder screen.",
  children,
}: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{caption}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.xl,
    backgroundColor: colors.bg,
  },
  title: {
    color: colors.textStrong,
    fontSize: fontSizes.xxxl,
    fontWeight: "700",
  },
  caption: {
    color: colors.text,
    fontSize: fontSizes.lg,
    textAlign: "center",
  },
});
