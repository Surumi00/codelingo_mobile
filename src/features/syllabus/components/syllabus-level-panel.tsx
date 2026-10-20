import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

import { formatLevelLabel, type SyllabusLevel } from "@/features/syllabus";
import { SyllabusTopicDetail } from "@/features/syllabus/components/syllabus-topic-detail";
import { SyllabusTopicStrip } from "@/features/syllabus/components/syllabus-topic-strip";
import { syllabusStyles as styles } from "@/features/syllabus/components/syllabus-styles";
import { gradients } from "@/theme";

export type SyllabusLevelPanelProps = {
  level: SyllabusLevel;
  levelNumber: number;
  isRecommended: boolean;
  topicIndex: number;
  onSelectTopic: (index: number) => void;
};

export function SyllabusLevelPanel({
  level,
  levelNumber,
  isRecommended,
  topicIndex,
  onSelectTopic,
}: SyllabusLevelPanelProps) {
  const activeTopic = topicIndex >= 0 ? level.topics[topicIndex] : null;

  return (
    <View style={styles.levelCard}>
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.levelHeader}
      >
        <View style={styles.levelBadges}>
          <View style={styles.levelTag}>
            <Text style={styles.levelTagText}>{`LEVEL ${levelNumber}`}</Text>
          </View>
          {isRecommended ? (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedBadgeText}>Recommended start</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.levelTitle}>{formatLevelLabel(level.name)}</Text>
      </LinearGradient>

      <View style={styles.levelBody}>
        {level.description ? (
          <Text style={styles.levelDescription}>{level.description}</Text>
        ) : null}

        {level.topics.length === 0 ? (
          <View style={styles.inlineEmpty}>
            <Text style={styles.stateText}>
              No topics are available for this level yet.
            </Text>
          </View>
        ) : (
          <>
            <SyllabusTopicStrip
              topics={level.topics}
              activeIndex={topicIndex}
              onSelect={onSelectTopic}
            />
            {activeTopic ? <SyllabusTopicDetail topic={activeTopic} /> : null}
          </>
        )}
      </View>
    </View>
  );
}
