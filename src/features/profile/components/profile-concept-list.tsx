import { Text, View } from "react-native";

import type { DiagnosisConcept } from "@/features/profile";
import { profileStyles as styles } from "@/features/profile/components/profile-styles";
import { colors } from "@/theme";

export type ProfileConceptListProps = {
  concepts: DiagnosisConcept[];
};

const SCORE_DOTS = [1, 2, 3, 4, 5];

function getStatusColor(status: DiagnosisConcept["status"]) {
  if (status === "Strong") {
    return colors.success;
  }

  if (status === "Developing") {
    return colors.warning;
  }

  return colors.danger;
}

export function ProfileConceptList({ concepts }: ProfileConceptListProps) {
  if (concepts.length === 0) {
    return (
      <Text style={styles.stateText}>No concept breakdown was returned.</Text>
    );
  }

  return (
    <View style={styles.conceptList}>
      {concepts.map((concept, index) => {
        const statusColor = getStatusColor(concept.status);

        return (
          <View
            key={`${concept.name}-${index}`}
            style={[
              styles.conceptRow,
              index === concepts.length - 1 ? styles.conceptRowLast : null,
            ]}
          >
            <Text style={styles.conceptName}>{concept.name}</Text>
            <View style={styles.conceptMeta}>
              <View
                style={styles.progressDots}
                accessibilityLabel={`${concept.score} out of 5`}
              >
                {SCORE_DOTS.map((dot) => (
                  <View
                    key={dot}
                    style={[
                      styles.dot,
                      dot <= concept.score ? styles.dotFilled : null,
                    ]}
                  />
                ))}
              </View>
              <View style={[styles.statusTag, { borderColor: statusColor }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {concept.status}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
