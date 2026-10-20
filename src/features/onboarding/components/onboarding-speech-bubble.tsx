import { Text, View } from "react-native";

import { onboardingStyles as styles } from "@/features/onboarding/components/onboarding-styles";

export type SpeechBubbleProps = {
  text: string;
};

export function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <View style={styles.bubbleWrap}>
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{text}</Text>
        <View style={styles.bubbleTail} />
      </View>
    </View>
  );
}
