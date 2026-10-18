import type { ImageSourcePropType } from "react-native";

export type MascotMood =
  | "happy"
  | "hi"
  | "excited"
  | "confused"
  | "crying"
  | "sad"
  | "thinking"
  | "celebrating"
  | "struggling";

export const mascotImages: Record<MascotMood, ImageSourcePropType> = {
  happy: require("@/assets/characters/happy.png"),
  hi: require("@/assets/characters/hi.png"),
  excited: require("@/assets/characters/excited.png"),
  confused: require("@/assets/characters/confused.png"),
  crying: require("@/assets/characters/crying.png"),
  sad: require("@/assets/characters/sad.png"),
  thinking: require("@/assets/characters/thinking.png"),
  celebrating: require("@/assets/characters/celebrating.png"),
  struggling: require("@/assets/characters/strugling.png"),
};

export const mascotMoods = Object.keys(mascotImages) as MascotMood[];
