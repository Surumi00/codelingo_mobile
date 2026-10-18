import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fontSizes, gradients, radii, spacing } from "@/theme";

export type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.8 }}
        style={[styles.gradient, disabled ? styles.disabled : null]}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    borderRadius: radii.sm,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    color: colors.onAccent,
    fontSize: fontSizes.lg,
    fontWeight: "800",
  },
});
