import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { getApiErrorMessage, getSyllabus } from "@/api";
import { PrimaryButton } from "@/components/primary-button";
import {
  extractLevels,
  resolveRecommendedLevelIndex,
  type SyllabusLevel,
} from "@/features/syllabus";
import { SyllabusLevelPanel } from "@/features/syllabus/components/syllabus-level-panel";
import { SyllabusLevelTabs } from "@/features/syllabus/components/syllabus-level-tabs";
import { syllabusStyles as styles } from "@/features/syllabus/components/syllabus-styles";
import { getDiagnosticResult } from "@/storage";
import { colors } from "@/theme";

type LoadState = "loading" | "ready" | "empty" | "error";

export function SyllabusScreen() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [levels, setLevels] = useState<SyllabusLevel[]>([]);
  const [recommendedIndex, setRecommendedIndex] = useState(-1);
  const [levelIndex, setLevelIndex] = useState(0);
  const [topicIndex, setTopicIndex] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const [syllabusPayload, savedResult] = await Promise.all([
          getSyllabus(),
          getDiagnosticResult(),
        ]);

        if (!isMounted.current) {
          return;
        }

        const nextLevels = extractLevels(syllabusPayload);
        const nextRecommendedIndex = savedResult
          ? resolveRecommendedLevelIndex(nextLevels, savedResult)
          : -1;

        setLevels(nextLevels);
        setRecommendedIndex(nextRecommendedIndex);
        setLevelIndex(nextRecommendedIndex >= 0 ? nextRecommendedIndex : 0);
        setTopicIndex(0);
        setLoadState(nextLevels.length === 0 ? "empty" : "ready");
      } catch (error) {
        if (!isMounted.current) {
          return;
        }

        setLoadError(
          getApiErrorMessage(
            error,
            "We could not load the syllabus right now. Please try again.",
          ),
        );
        setLoadState("error");
      }
    })();
  }, [loadAttempt]);

  const handleRetry = () => {
    setLoadError("");
    setLoadState("loading");
    setLoadAttempt((currentAttempt) => currentAttempt + 1);
  };

  const handleSelectLevel = (index: number) => {
    setLevelIndex(index);
    setTopicIndex(0);
  };

  const handleSelectTopic = (index: number) => {
    setTopicIndex(index);
  };

  if (loadState === "loading") {
    return (
      <View style={styles.screen}>
        <View style={styles.centered}>
          <View style={styles.stateCard}>
            <ActivityIndicator color={colors.accentSoft} size="large" />
            <Text style={styles.stateText}>Loading syllabus…</Text>
          </View>
        </View>
      </View>
    );
  }

  if (loadState === "error") {
    return (
      <View style={styles.screen}>
        <View style={styles.centered}>
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Syllabus unavailable</Text>
            <Text style={styles.stateText}>{loadError}</Text>
            <PrimaryButton label="Retry" onPress={handleRetry} />
          </View>
        </View>
      </View>
    );
  }

  if (loadState === "empty") {
    return (
      <View style={styles.screen}>
        <View style={styles.centered}>
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>No syllabus content yet</Text>
            <Text style={styles.stateText}>
              The backend has not published any syllabus levels for this
              account.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const activeIndex = Math.min(levelIndex, levels.length - 1);
  const activeLevel = levels[activeIndex];
  const topicCount = activeLevel.topics.length;
  const activeTopicIndex =
    topicCount === 0 ? -1 : Math.min(topicIndex, topicCount - 1);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.shell}>
        <SyllabusLevelTabs
          levels={levels}
          activeIndex={activeIndex}
          recommendedIndex={recommendedIndex}
          onSelect={handleSelectLevel}
        />
        <SyllabusLevelPanel
          level={activeLevel}
          levelNumber={activeIndex + 1}
          isRecommended={activeIndex === recommendedIndex}
          topicIndex={activeTopicIndex}
          onSelectTopic={handleSelectTopic}
        />
      </View>
    </ScrollView>
  );
}
