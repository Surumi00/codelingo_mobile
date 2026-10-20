import { getDiagnosticResult, getMe } from "@/api";
import { getDiagnosticResult as getSavedDiagnosticResult } from "@/storage";

export type EntryRoute = "Onboarding" | "DiagnosticResults";

export async function resolveEntryRoute(): Promise<EntryRoute> {
  const user = await getMe();

  if (!user.occupation || !user.experienceLevel) {
    return "Onboarding";
  }

  const result =
    (await getDiagnosticResult()) ?? (await getSavedDiagnosticResult());

  return result ? "DiagnosticResults" : "Onboarding";
}
