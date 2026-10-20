import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getApiErrorMessage, saveOnboarding } from "@/api";
import { Mascot } from "@/components/mascot";
import { PrimaryButton } from "@/components/primary-button";
import {
  initialOnboardingAnswers,
  onboardingData,
  toSaveOnboardingRequest,
  type OnboardingAnswerKey,
  type OnboardingAnswers,
} from "@/features/onboarding";
import { OptionCard } from "@/features/onboarding/components/onboarding-option-card";
import { SpeechBubble } from "@/features/onboarding/components/onboarding-speech-bubble";
import { StepDots } from "@/features/onboarding/components/onboarding-step-dots";
import { onboardingStyles as styles } from "@/features/onboarding/components/onboarding-styles";
import type { SignedInStackParamList } from "@/navigation/types";
import { spacing } from "@/theme";

type Props = NativeStackScreenProps<SignedInStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(
    initialOnboardingAnswers,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const saveGuard = useRef(false);

  const step = onboardingData[currentStep];
  const isLastStep = currentStep === onboardingData.length - 1;
  const currentAnswer = step.answerKey ? answers[step.answerKey] : "";
  const canContinue = !step.answerKey || Boolean(currentAnswer);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (currentStep === 0) {
          return false;
        }

        setSaveError("");
        setCurrentStep((current) => current - 1);
        return true;
      },
    );

    return () => subscription.remove();
  }, [currentStep]);

  const goToPreviousStep = () => {
    setSaveError("");
    setCurrentStep((current) => Math.max(0, current - 1));
  };

  const selectAnswer = (answerKey: OnboardingAnswerKey, value: string) => {
    setSaveError("");
    setAnswers((current) => ({ ...current, [answerKey]: value }));
  };

  const submitOnboarding = async () => {
    if (saveGuard.current) {
      return;
    }

    const payload = toSaveOnboardingRequest(answers);

    if (!payload) {
      setSaveError("Please answer every question before continuing.");
      return;
    }

    saveGuard.current = true;
    setSaveError("");
    setIsSaving(true);

    try {
      await saveOnboarding(payload);
      saveGuard.current = false;
      setIsSaving(false);
      navigation.navigate("Diagnostic");
    } catch (error) {
      saveGuard.current = false;
      setIsSaving(false);
      setSaveError(
        getApiErrorMessage(
          error,
          "We couldn't save your answers. Please try again.",
        ),
      );
    }
  };

  const goToNextStep = () => {
    setSaveError("");
    setCurrentStep((current) => current + 1);
  };

  const handleContinue = () => {
    if (isLastStep) {
      void submitOnboarding();
      return;
    }

    goToNextStep();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topBar}>
        {currentStep > 0 ? (
          <Pressable
            onPress={goToPreviousStep}
            disabled={isSaving}
            accessibilityRole="button"
            hitSlop={8}
            style={styles.backButton}
          >
            <Text style={styles.backLabel}>‹ Back</Text>
          </Pressable>
        ) : null}
        <StepDots total={onboardingData.length} current={currentStep} />
      </View>

      <View
        style={[
          styles.body,
          step.variant === "learning" ? styles.bodyQuestion : null,
        ]}
      >
        {step.variant === "welcome" ? (
          <View style={styles.welcomeHero}>
            <Mascot mood={step.image} size={112} />
            <View style={styles.welcomeCopy}>
              <Text style={styles.welcomeTitle}>{step.title}</Text>
              {step.description ? (
                <Text style={styles.welcomeDescription}>
                  {step.description}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {step.variant === "message" || step.variant === "project-intro" ? (
          <View style={styles.hero}>
            <SpeechBubble text={step.title} />
            <Mascot mood={step.image} size={112} />
          </View>
        ) : null}

        {step.variant === "learning" ? (
          <View style={styles.questionStep}>
            <View style={styles.questionHeader}>
              <Mascot mood={step.image} size={80} />
              <View style={styles.questionBubble}>
                <View style={styles.questionBubbleTail} />
                <Text style={styles.questionText}>{step.title}</Text>
              </View>
            </View>
            <View style={styles.options}>
              {step.options?.map((option) => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={currentAnswer === option.value}
                  onPress={() => {
                    if (step.answerKey) {
                      selectAnswer(step.answerKey, option.value);
                    }
                  }}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        {saveError ? (
          <Text
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={styles.loadError}
          >
            {saveError}
          </Text>
        ) : null}
        <PrimaryButton
          label={step.buttonText}
          onPress={handleContinue}
          disabled={!canContinue}
          loading={isSaving}
        />
      </View>
    </ScrollView>
  );
}
