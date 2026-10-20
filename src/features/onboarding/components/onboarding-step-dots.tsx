import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import { onboardingStyles as styles } from "@/features/onboarding/components/onboarding-styles";
import { gradients } from "@/theme";

export type StepDotsProps = {
  total: number;
  current: number;
};

export function StepDots({ total, current }: StepDotsProps) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }, (_, index) =>
        index === current ? (
          <LinearGradient
            key={index}
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.dot, styles.dotActive]}
          />
        ) : (
          <View key={index} style={styles.dot} />
        ),
      )}
    </View>
  );
}
