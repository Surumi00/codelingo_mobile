import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "@/features/auth/components/login-screen";
import { RegisterScreen } from "@/features/auth/components/register-screen";
import { stackScreenOptions } from "@/navigation/stack-options";
import type { SignedOutStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<SignedOutStackParamList>();

export function SignedOutNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ ...stackScreenOptions, headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
