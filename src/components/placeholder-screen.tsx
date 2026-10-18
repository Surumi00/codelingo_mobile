import { StyleSheet, Text, View } from "react-native";

export function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CodeLingo</Text>
      <Text style={styles.caption}>
        Project setup complete. Placeholder screen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  caption: {
    fontSize: 16,
    color: "#555555",
    textAlign: "center",
  },
});
