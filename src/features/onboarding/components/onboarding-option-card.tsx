import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import type { OnboardingOption } from "@/features/onboarding";
import { onboardingStyles as styles } from "@/features/onboarding/components/onboarding-styles";
import { gradients } from "@/theme";

export type OptionCardProps = {
  option: OnboardingOption;
  selected: boolean;
  onPress: () => void;
};

export function OptionCard({ option, selected, onPress }: OptionCardProps) {
  const isComingSoon = Boolean(option.comingSoon);

  return (
    <Pressable
      onPress={onPress}
      disabled={isComingSoon}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: isComingSoon }}
      style={[
        styles.optionRow,
        selected ? styles.optionRowSelected : null,
        isComingSoon ? styles.optionRowDisabled : null,
      ]}
    >
      {selected ? (
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.optionFill}
        />
      ) : null}
      <Text style={styles.optionLabel}>{option.label}</Text>
      <Text style={styles.optionName}>{option.name}</Text>
      {isComingSoon ? (
        <View style={styles.comingSoonChip}>
          <Text style={styles.comingSoonText}>Coming soon</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
