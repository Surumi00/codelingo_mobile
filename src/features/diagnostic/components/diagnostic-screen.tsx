import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import {
  getApiErrorMessage,
  getDiagnosticQuestions,
  submitDiagnostic,
  type DiagnosticQuestion,
} from "@/api";
import { PrimaryButton } from "@/components/primary-button";
import {
  areAllQuestionsAnswered,
  createDiagnosticAnswers,
  formatConceptLabel,
  getProgressPercentage,
  getSelectedOption,
  setAnswerAt,
  toSubmitDiagnosticRequest,
  type DiagnosticAnswers,
} from "@/features/diagnostic";
import { DiagnosticOptionRow } from "@/features/diagnostic/components/diagnostic-option-row";
import { DiagnosticSecondaryButton } from "@/features/diagnostic/components/diagnostic-secondary-button";
import { diagnosticStyles as styles } from "@/features/diagnostic/components/diagnostic-quiz-styles";
import type { SignedInStackParamList } from "@/navigation/types";
import { setDiagnosticResult } from "@/storage";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<SignedInStackParamList, "Diagnostic">;

type LoadState = "loading" | "ready" | "empty" | "error";

export function DiagnosticScreen({ navigation }: Props) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [answers, setAnswers] = useState<DiagnosticAnswers>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitGuard = useRef(false);
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
        const nextQuestions = await getDiagnosticQuestions();

        if (!isMounted.current) {
          return;
        }

        setQuestions(nextQuestions);
        setAnswers(createDiagnosticAnswers(nextQuestions.length));
        setCurrentIndex(0);
        setLoadState(nextQuestions.length === 0 ? "empty" : "ready");
      } catch (error) {
        if (!isMounted.current) {
          return;
        }

        setLoadError(
          getApiErrorMessage(
            error,
            "We could not load the diagnostic. Please try again.",
          ),
        );
        setLoadState("error");
      }
    })();
  }, [loadAttempt]);

  const handleRetryLoad = () => {
    setLoadError("");
    setSubmitError("");
    setLoadState("loading");
    setLoadAttempt((currentAttempt) => currentAttempt + 1);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setSubmitError("");
    setAnswers((currentAnswers) =>
      setAnswerAt(currentAnswers, currentIndex, optionIndex),
    );
  };

  const handleBack = () => {
    setSubmitError("");
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const handleNext = () => {
    setSubmitError("");
    setCurrentIndex((index) => Math.min(questions.length - 1, index + 1));
  };

  const handleFinish = async () => {
    if (submitGuard.current) {
      return;
    }

    const payload = toSubmitDiagnosticRequest(questions, answers);

    if (!payload) {
      setSubmitError("Please answer every question before finishing the test.");
      return;
    }

    submitGuard.current = true;
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const result = await submitDiagnostic(payload);

      await setDiagnosticResult(result);
      submitGuard.current = false;
      setIsSubmitting(false);
      navigation.navigate("DiagnosticResults", { result });
    } catch (error) {
      submitGuard.current = false;
      setIsSubmitting(false);
      setSubmitError(
        getApiErrorMessage(
          error,
          "We could not submit your answers. Please try again.",
        ),
      );
    }
  };

  if (loadState === "loading") {
    return (
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.stateCard}>
            <ActivityIndicator color={colors.accentSoft} size="large" />
            <Text style={styles.stateText}>Loading questions…</Text>
          </View>
        </View>
      </View>
    );
  }

  if (loadState === "error") {
    return (
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>
              Unable to start the diagnostic
            </Text>
            <Text style={styles.stateText}>{loadError}</Text>
            <PrimaryButton label="Retry" onPress={handleRetryLoad} />
          </View>
        </View>
      </View>
    );
  }

  if (loadState === "empty") {
    return (
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>No diagnostic questions.</Text>
            <Text style={styles.stateText}>
              The diagnostic has nothing to ask right now.
            </Text>
            <PrimaryButton label="Retry" onPress={handleRetryLoad} />
          </View>
        </View>
      </View>
    );
  }

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const selectedOption = getSelectedOption(answers, currentIndex);
  const isFinalQuestion = currentIndex === totalQuestions - 1;
  const canFinish = areAllQuestionsAnswered(answers);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[colors.accentSoft, colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressFill,
                {
                  width: `${getProgressPercentage(currentIndex, totalQuestions)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {`Question ${currentIndex + 1} of ${totalQuestions}`}
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.topic}>
            {`${formatConceptLabel(currentQuestion.conceptSlug)} · ${currentQuestion.difficulty.toUpperCase()}`}
          </Text>
          <Text style={styles.question}>{currentQuestion.prompt}</Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="Answer choices"
            style={styles.options}
          >
            {currentQuestion.options.map((option, optionIndex) => (
              <DiagnosticOptionRow
                key={`${currentQuestion.id}-${optionIndex}`}
                label={option}
                selected={selectedOption === optionIndex}
                onPress={() => handleSelectAnswer(optionIndex)}
              />
            ))}
          </View>
        </View>

        {submitError ? (
          <Text
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={styles.formError}
          >
            {submitError}
          </Text>
        ) : null}

        <View style={styles.actions}>
          <View style={styles.actionBack}>
            <DiagnosticSecondaryButton
              label="Back"
              onPress={handleBack}
              disabled={currentIndex === 0}
            />
          </View>
          <View style={styles.actionPrimary}>
            {isFinalQuestion ? (
              <PrimaryButton
                label="Finish test"
                onPress={() => {
                  void handleFinish();
                }}
                disabled={!canFinish}
                loading={isSubmitting}
              />
            ) : (
              <PrimaryButton
                label="Next →"
                onPress={handleNext}
                disabled={selectedOption === null}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
