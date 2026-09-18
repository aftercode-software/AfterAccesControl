import { Image, View } from "react-native";

export default function BrandLogo({
  className = "h-[49px] w-28",
}: {
  className?: string;
}) {
  return (
    <View className={`h-[49px] w-28 ${className}`}>
      <Image
        source={require("@/assets/etrack-access-logo.png")}
        accessibilityLabel="Etrack Access"
        className="h-full w-full"
        resizeMode="contain"
      />
    </View>
  );
}
