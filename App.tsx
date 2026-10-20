import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { setTokenStore } from "@/api";
import { AuthProvider } from "@/features/auth/auth-provider";
import { RootNavigator } from "@/navigation/root-navigator";
import { clearToken, getToken, setToken } from "@/storage/auth-storage";

setTokenStore({ get: getToken, set: setToken, clear: clearToken });

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
