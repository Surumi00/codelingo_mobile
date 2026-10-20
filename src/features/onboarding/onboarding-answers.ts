import type { ExperienceLevel, SaveOnboardingRequest } from "@/api";
import {
  onboardingData,
  type OnboardingStep,
} from "@/features/onboarding/onboarding-data";

export type OnboardingAnswerKey = NonNullable<OnboardingStep["answerKey"]>;

export type OnboardingAnswers = Record<OnboardingAnswerKey, string>;

export const initialOnboardingAnswers: OnboardingAnswers = {
  occupation: "",
  experienceLevel: "",
  language: "",
};

function findAnswerStep(answerKey: OnboardingAnswerKey) {
  return onboardingData.find((step) => step.answerKey === answerKey);
}

export function isOnboardingOptionValue(
  answerKey: OnboardingAnswerKey,
  value: string,
): boolean {
  return Boolean(
    findAnswerStep(answerKey)?.options?.some(
      (option) => option.value === value,
    ),
  );
}

export function toSaveOnboardingRequest(
  answers: OnboardingAnswers,
): SaveOnboardingRequest | null {
  const { occupation, experienceLevel, language } = answers;

  if (!isOnboardingOptionValue("occupation", occupation)) {
    return null;
  }

  if (!isOnboardingOptionValue("experienceLevel", experienceLevel)) {
    return null;
  }

  if (language !== "PYTHON") {
    return null;
  }

  return {
    occupation,
    experienceLevel: experienceLevel as ExperienceLevel,
    language,
  };
}
