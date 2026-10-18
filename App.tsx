import {
  DarkTheme,
  NavigationContainer,
  type Theme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { setTokenStore } from "@/api";
import { MascotGalleryScreen } from "@/components/mascot-gallery-screen";
import { PlaceholderScreen } from "@/components/placeholder-screen";
import { clearToken, getToken, setToken } from "@/storage/auth-storage";
import { colors } from "@/theme";

setTokenStore({ get: getToken, set: setToken, clear: clearToken });

export type RootStackParamList = {
  MascotGallery: undefined;
  Placeholder: undefined;
};

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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator initialRouteName="MascotGallery">
          <Stack.Screen
            name="MascotGallery"
            component={MascotGalleryScreen}
            options={{ title: "CodeLingo" }}
          />
          <Stack.Screen
            name="Placeholder"
            component={PlaceholderScreen}
            options={{ title: "CodeLingo" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </>
  );
}
