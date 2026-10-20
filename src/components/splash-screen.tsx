import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Mascot } from "@/components/mascot";
import { colors, fontSizes, spacing } from "@/theme";

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Mascot mood="happy" size={160} />
      <Text style={styles.title}>codelingo</Text>
      <Text style={styles.caption}>learn to code for real</Text>
      <ActivityIndicator color={colors.accent} style={styles.spinner} />
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
    fontSize: fontSizes.md,
  },
  spinner: {
    marginTop: spacing.lg,
  },
});
