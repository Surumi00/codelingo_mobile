import type { DiagnosticSubmitResponse } from "@/features/diagnostic";

export type SignedOutStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type DiagnosticResultsParams =
  | {
      result?: DiagnosticSubmitResponse;
    }
  | undefined;

export type SignedInStackParamList = {
  Onboarding: undefined;
  Diagnostic: undefined;
  DiagnosticResults: DiagnosticResultsParams;
  Syllabus: undefined;
  Profile: undefined;
};
