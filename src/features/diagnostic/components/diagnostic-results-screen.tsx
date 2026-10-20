import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import type { DiagnosticSubmitResponse } from "@/api";
import { PrimaryButton } from "@/components/primary-button";
import { formatConceptLabel, toBreakdownRows } from "@/features/diagnostic";
import { diagnosticResultsStyles as styles } from "@/features/diagnostic/components/diagnostic-results-styles";
import { formatLevelLabel } from "@/features/syllabus";
import type { SignedInStackParamList } from "@/navigation/types";
import { getDiagnosticResult } from "@/storage";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<
  SignedInStackParamList,
  "DiagnosticResults"
>;

export function DiagnosticResultsScreen({ navigation, route }: Props) {
  const routeResult = route.params?.result;
  const [storedResult, setStoredResult] =
    useState<DiagnosticSubmitResponse | null>(null);
  const [isResolving, setIsResolving] = useState(!routeResult);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (routeResult) {
      return;
    }

    void (async () => {
      const savedResult = await getDiagnosticResult();

      if (!isMounted.current) {
        return;
      }

      setStoredResult(savedResult);
      setIsResolving(false);
    })();
  }, [routeResult]);

  const result = routeResult ?? storedResult;

  if (isResolving) {
    return (
      <View style={styles.screen}>
        <View style={styles.centered}>
          <View style={styles.stateCard}>
            <ActivityIndicator color={colors.accentSoft} size="large" />
            <Text style={styles.stateText}>Loading your results…</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.screen}>
        <View style={styles.centered}>
          <View style={styles.stateCard}>
            <Text style={styles.kicker}>Diagnostic review</Text>
            <Text style={styles.stateTitle}>Results are not available yet</Text>
            <Text style={styles.stateText}>
              Complete the diagnostic to see your score and recommended starting
              point.
            </Text>
            <PrimaryButton
              label="Take the diagnostic"
              onPress={() => navigation.navigate("Diagnostic")}
            />
          </View>
        </View>
      </View>
    );
  }

  const breakdownRows = toBreakdownRows(result.breakdown);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.shell}>
        <View style={styles.heading}>
          <Text style={styles.kicker}>CodeLingo · Diagnostic review</Text>
          <Text style={styles.title}>Diagnostic complete</Text>
        </View>

        <LinearGradient
          colors={[colors.surfaceRaised, colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.scoreBlock}>
            <Text style={styles.label}>Your score</Text>
            <Text style={styles.score}>
              {result.score}
              <Text
                style={styles.scoreTotal}
              >{` / ${result.totalQuestions}`}</Text>
            </Text>
            <Text style={styles.percentage}>{`${result.percentage}%`}</Text>
          </View>

          <View style={styles.placementBlock}>
            <Text style={styles.label}>Assigned level</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>
                {formatLevelLabel(result.level)}
              </Text>
            </View>
            {result.startingSyllabusLevel ? (
              <Text style={styles.placementNote}>
                {"Recommended start: "}
                <Text style={styles.placementNoteStrong}>
                  {formatLevelLabel(result.startingSyllabusLevel.title)}
                </Text>
              </Text>
            ) : null}
          </View>
        </LinearGradient>

        <View style={styles.detailBlock}>
          <Text style={styles.detailTitle}>AI review</Text>
          <Text style={styles.reviewText}>{result.review}</Text>
        </View>

        <View style={styles.detailBlock}>
          <Text style={styles.detailTitle}>Concept breakdown</Text>
          {breakdownRows.length === 0 ? (
            <Text style={styles.stateText}>
              No concept breakdown was returned.
            </Text>
          ) : (
            <View>
              {breakdownRows.map((row, index) => (
                <View
                  key={row.slug}
                  style={[
                    styles.breakdownRow,
                    index === breakdownRows.length - 1
                      ? styles.breakdownRowLast
                      : null,
                  ]}
                >
                  <Text style={styles.breakdownLabel}>
                    {formatConceptLabel(row.slug)}
                  </Text>
                  <Text style={styles.breakdownValue}>
                    {`${row.correct} / ${row.total}`}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <PrimaryButton
          label="Start Learning →"
          onPress={() => navigation.navigate("Syllabus")}
        />
      </View>
    </ScrollView>
  );
}
