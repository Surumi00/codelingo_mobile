import { Text, View } from "react-native";

import { getTopicGlyph, type SyllabusTopic } from "@/features/syllabus";
import { syllabusStyles as styles } from "@/features/syllabus/components/syllabus-styles";

export type SyllabusTopicDetailProps = {
  topic: SyllabusTopic;
};

export function SyllabusTopicDetail({ topic }: SyllabusTopicDetailProps) {
  return (
    <View style={styles.topicDetail}>
      <View style={styles.detailIcon}>
        <Text style={styles.detailGlyph}>{getTopicGlyph(topic)}</Text>
      </View>
      <Text style={styles.detailTitle}>{topic.name}</Text>
      {topic.concepts.length > 0 ? (
        <View style={styles.detailList}>
          {topic.concepts.map((concept) => (
            <View key={String(concept.id)} style={styles.detailRow}>
              <View style={styles.detailDot} />
              <Text style={styles.detailConcept}>{concept.name}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.detailEmpty}>
          {topic.description ?? "Concepts for this topic are coming soon."}
        </Text>
      )}
    </View>
  );
}
