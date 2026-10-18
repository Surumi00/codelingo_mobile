import { Image, type ImageStyle, type StyleProp } from "react-native";

import { mascotImages, type MascotMood } from "@/components/mascot-images";

export type MascotProps = {
  mood: MascotMood;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function Mascot({ mood, size = 120, style }: MascotProps) {
  return (
    <Image
      source={mascotImages[mood]}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
}
