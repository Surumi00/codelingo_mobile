import { createContext, useContext } from "react";

import type { EntryRoute } from "@/features/auth/entry-route";

export type AuthStatus = "loading" | "signedOut" | "signedIn";

export type AuthContextValue = {
  status: AuthStatus;
  entryRoute: EntryRoute | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }

  return value;
}
