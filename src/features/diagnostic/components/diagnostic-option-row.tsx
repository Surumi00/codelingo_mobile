import { Pressable, Text, View } from "react-native";

import { diagnosticStyles as styles } from "@/features/diagnostic/components/diagnostic-quiz-styles";

export type DiagnosticOptionRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function DiagnosticOptionRow({
  label,
  selected,
  onPress,
}: DiagnosticOptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.option, selected ? styles.optionSelected : null]}
    >
      <View
        style={[
          styles.optionIndicator,
          selected ? styles.optionIndicatorSelected : null,
        ]}
      >
        {selected ? <View style={styles.optionIndicatorDot} /> : null}
      </View>
      <Text style={styles.optionLabel}>{label}</Text>
    </Pressable>
  );
}
