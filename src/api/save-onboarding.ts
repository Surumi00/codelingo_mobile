import { client } from "./client";
import type { ExperienceLevel, SupportedLanguage, User } from "./types";

export type SaveOnboardingRequest = {
  occupation: string;
  experienceLevel: ExperienceLevel;
  language: SupportedLanguage;
};

export type SaveOnboardingResponse = {
  message: string;
  user: User;
};

export async function saveOnboarding(
  payload: SaveOnboardingRequest,
): Promise<SaveOnboardingResponse> {
  const { data } = await client.post<SaveOnboardingResponse>(
    "/me/onboarding",
    payload,
  );

  return data;
}
