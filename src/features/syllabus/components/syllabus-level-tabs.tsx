import { Pressable, ScrollView, Text } from "react-native";

import { formatLevelLabel, type SyllabusLevel } from "@/features/syllabus";
import { syllabusStyles as styles } from "@/features/syllabus/components/syllabus-styles";

export type SyllabusLevelTabsProps = {
  levels: SyllabusLevel[];
  activeIndex: number;
  recommendedIndex: number;
  onSelect: (index: number) => void;
};

export function SyllabusLevelTabs({
  levels,
  activeIndex,
  recommendedIndex,
  onSelect,
}: SyllabusLevelTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsRow}
      accessibilityRole="tablist"
    >
      {levels.map((level, index) => {
        const isActive = index === activeIndex;
        const isRecommended = index === recommendedIndex;

        return (
          <Pressable
            key={String(level.id)}
            onPress={() => onSelect(index)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Open ${formatLevelLabel(level.name)}`}
            style={[styles.tab, isActive ? styles.tabActive : null]}
          >
            <Text
              style={[
                styles.tabNumber,
                isActive ? styles.tabNumberActive : null,
              ]}
            >
              {index + 1}
            </Text>
            <Text style={styles.tabName}>{formatLevelLabel(level.name)}</Text>
            {isRecommended ? <Text style={styles.tabStar}>★</Text> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
