import { StyleSheet, Text, View } from "react-native";

import { colors, fontSizes, spacing } from "@/theme";

export function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CodeLingo</Text>
      <Text style={styles.caption}>
        Project setup complete. Placeholder screen.
      </Text>
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
