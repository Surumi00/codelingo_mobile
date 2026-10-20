import { Pressable, ScrollView, Text, View } from "react-native";

import { getTopicGlyph, type SyllabusTopic } from "@/features/syllabus";
import { syllabusStyles as styles } from "@/features/syllabus/components/syllabus-styles";

export type SyllabusTopicStripProps = {
  topics: SyllabusTopic[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function SyllabusTopicStrip({
  topics,
  activeIndex,
  onSelect,
}: SyllabusTopicStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.topicsRow}
    >
      {topics.map((topic, index) => {
        const isActive = index === activeIndex;

        return (
          <Pressable
            key={String(topic.id)}
            onPress={() => onSelect(index)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Show ${topic.name}`}
            style={styles.topicCard}
          >
            <View
              style={[
                styles.topicVisual,
                isActive ? styles.topicVisualSelected : null,
              ]}
            >
              <Text style={styles.topicGlyph}>{getTopicGlyph(topic)}</Text>
            </View>
            <Text style={styles.topicLabel}>{topic.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
