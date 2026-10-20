import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fontSizes } from "@/theme";

export type HeaderLinkProps = {
  label: string;
  onPress: () => void;
};

export function HeaderLink({ label, onPress }: HeaderLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.accentSoft,
    fontSize: fontSizes.lg,
    fontWeight: "700",
  },
});
