import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fontSizes, radii, spacing } from "@/theme";

export type DiagnosticSecondaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function DiagnosticSecondaryButton({
  label,
  onPress,
  disabled = false,
}: DiagnosticSecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={[styles.button, disabled ? styles.disabled : null]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.sm,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    color: colors.textStrong,
    fontSize: fontSizes.lg,
    fontWeight: "800",
  },
});
