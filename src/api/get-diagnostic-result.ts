import { client, getHttpStatus } from "./client";
import type { DiagnosticSubmitResponse } from "./submit-diagnostic";

const NO_RESULT_STATUSES = [400, 404, 422];

export async function getDiagnosticResult(): Promise<DiagnosticSubmitResponse | null> {
  try {
    const response =
      await client.get<DiagnosticSubmitResponse>("/diagnostic/result");

    if (response.status === 204 || !response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    const status = getHttpStatus(error);

    if (status !== null && NO_RESULT_STATUSES.includes(status)) {
      return null;
    }

    throw error;
  }
}
