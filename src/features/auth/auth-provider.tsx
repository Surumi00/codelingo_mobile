import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { setOnUnauthorized } from "@/api";
import { AuthContext, type AuthStatus } from "@/features/auth/auth-context";
import {
  resolveEntryRoute,
  type EntryRoute,
} from "@/features/auth/entry-route";
import {
  clearDiagnosticResult,
  clearToken,
  getToken,
  setToken,
} from "@/storage";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [entryRoute, setEntryRoute] = useState<EntryRoute | null>(null);

  useEffect(() => {
    let isActive = true;

    void (async () => {
      const token = await getToken().catch(() => null);

      if (!isActive) {
        return;
      }

      if (!token) {
        setStatus("signedOut");
        return;
      }

      let route: EntryRoute = "Onboarding";

      try {
        route = await resolveEntryRoute();
      } catch {
        route = "Onboarding";
      }

      if (!isActive) {
        return;
      }

      const currentToken = await getToken().catch(() => null);

      if (!isActive) {
        return;
      }

      if (!currentToken) {
        setStatus("signedOut");
        return;
      }

      setEntryRoute(route);
      setStatus("signedIn");
    })();

    return () => {
      isActive = false;
    };
  }, []);

  const signIn = useCallback(async (token: string) => {
    await setToken(token);

    let route: EntryRoute = "Onboarding";

    try {
      route = await resolveEntryRoute();
    } catch {
      route = "Onboarding";
    }

    setEntryRoute(route);
    setStatus("signedIn");
  }, []);

  const signOut = useCallback(async () => {
    await clearToken();
    await clearDiagnosticResult();
    setEntryRoute(null);
    setStatus("signedOut");
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      void signOut();
    });

    return () => {
      setOnUnauthorized(null);
    };
  }, [signOut]);

  const value = useMemo(
    () => ({ status, entryRoute, signIn, signOut }),
    [status, entryRoute, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
