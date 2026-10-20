import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import { colors, fontSizes } from "@/theme";

export const stackScreenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.textStrong,
  headerTitleStyle: { fontSize: fontSizes.lg, fontWeight: "700" },
  contentStyle: { backgroundColor: colors.bg },
};
