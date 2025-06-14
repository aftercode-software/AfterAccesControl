import { Image } from "react-native";

export default function Logo() {
  return (
    <Image
      source={require("@/assets/logoDark.png")}
      className="w-22 h-20 mx-auto mb-4"
      style={{
        width: 60,
        height: 66,
      }}
    />
  );
}
