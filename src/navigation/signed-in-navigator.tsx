import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HeaderLink } from "@/components/header-link";
import { DiagnosticResultsScreen } from "@/features/diagnostic/components/diagnostic-results-screen";
import { DiagnosticScreen } from "@/features/diagnostic/components/diagnostic-screen";
import { useAuth } from "@/features/auth";
import { OnboardingScreen } from "@/features/onboarding/components/onboarding-screen";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { SyllabusScreen } from "@/features/syllabus/components/syllabus-screen";
import { stackScreenOptions } from "@/navigation/stack-options";
import type { SignedInStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<SignedInStackParamList>();

export function SignedInNavigator() {
  const { entryRoute } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={entryRoute ?? "Onboarding"}
      screenOptions={stackScreenOptions}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Diagnostic"
        component={DiagnosticScreen}
        options={{ title: "Diagnostic" }}
      />
      <Stack.Screen
        name="DiagnosticResults"
        component={DiagnosticResultsScreen}
        options={{ title: "Results" }}
      />
      <Stack.Screen
        name="Syllabus"
        component={SyllabusScreen}
        options={({ navigation }) => ({
          title: "Syllabus",
          headerRight: () => (
            <HeaderLink
              label="Profile"
              onPress={() => navigation.navigate("Profile")}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: "Profile",
          headerRight: () => (
            <HeaderLink
              label="Syllabus"
              onPress={() => navigation.navigate("Syllabus")}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
