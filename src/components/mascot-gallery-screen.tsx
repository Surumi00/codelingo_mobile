import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { heroImage } from "@/assets";
import { Mascot } from "@/components/mascot";
import { mascotMoods } from "@/components/mascot-images";
import { PrimaryButton } from "@/components/primary-button";
import { colors, fontSizes, radii, spacing } from "@/theme";

export function MascotGalleryScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="always"
    >
      <Text style={styles.title}>Mascots</Text>
      <Text style={styles.caption}>
        {mascotMoods.length} moods from the web app
      </Text>

      <View style={styles.grid}>
        {mascotMoods.map((mood) => (
          <View key={mood} style={styles.cell}>
            <Mascot mood={mood} size={88} />
            <Text style={styles.label}>{mood}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Hero image</Text>
      <Image source={heroImage} style={styles.hero} resizeMode="contain" />

      <Text style={styles.sectionTitle}>Primary button</Text>
      <PrimaryButton label="Start learning" />
      <View style={styles.gap} />
      <PrimaryButton label="Disabled" disabled />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  title: {
    color: colors.textStrong,
    fontSize: fontSizes.xxxl,
    fontWeight: "700",
  },
  caption: {
    color: colors.text,
    fontSize: fontSizes.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  cell: {
    alignItems: "center",
    gap: spacing.sm,
    width: 104,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  label: {
    color: colors.text,
    fontSize: fontSizes.xs,
  },
  sectionTitle: {
    color: colors.textStrong,
    fontSize: fontSizes.xl,
    fontWeight: "700",
  },
  hero: {
    alignSelf: "flex-start",
    width: 120,
    height: 120,
  },
  gap: {
    height: spacing.sm,
  },
});
