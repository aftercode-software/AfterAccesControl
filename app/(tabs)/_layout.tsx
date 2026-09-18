import BottomBar from "@/components/navbar/BottomBar";
import Header from "@/components/navbar/Header";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <View className="flex-1">
      <Header />
      <BottomBar />
    </View>
  );
}
