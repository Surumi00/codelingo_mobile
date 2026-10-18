import AsyncStorage from "@react-native-async-storage/async-storage";

import type { DiagnosticSubmitResponse } from "@/api";

const DIAGNOSTIC_RESULT_KEY = "diagnostic_result";

export async function getDiagnosticResult(): Promise<DiagnosticSubmitResponse | null> {
  try {
    const stored = await AsyncStorage.getItem(DIAGNOSTIC_RESULT_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as DiagnosticSubmitResponse;
  } catch {
    return null;
  }
}

export async function setDiagnosticResult(
  result: DiagnosticSubmitResponse,
): Promise<void> {
  try {
    await AsyncStorage.setItem(DIAGNOSTIC_RESULT_KEY, JSON.stringify(result));
  } catch {
    return;
  }
}

export async function clearDiagnosticResult(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DIAGNOSTIC_RESULT_KEY);
  } catch {
    return;
  }
}
