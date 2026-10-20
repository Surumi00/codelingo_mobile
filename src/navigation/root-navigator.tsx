import {
  DarkTheme,
  NavigationContainer,
  type Theme,
} from "@react-navigation/native";

import { SplashScreen } from "@/components/splash-screen";
import { useAuth } from "@/features/auth";
import { SignedInNavigator } from "@/navigation/signed-in-navigator";
import { SignedOutNavigator } from "@/navigation/signed-out-navigator";
import { colors } from "@/theme";

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.textStrong,
    border: colors.border,
    primary: colors.accent,
  },
};

export function RootNavigator() {
  const { status } = useAuth();

  if (status === "loading") {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {status === "signedIn" ? <SignedInNavigator /> : <SignedOutNavigator />}
    </NavigationContainer>
  );
}
