import { View } from "react-native";
import React from "react";
import { TabIconProps } from "@/interfaces/tabIcon";

export default function TabIcon({ IconComponent, color, focused }: TabIconProps) {
  return (
    <View className="items-center gap-[3px]">
      <IconComponent color={color} />
      <View
        className={`h-[3px] w-[18px] bg-amber ${
          focused ? "opacity-100" : "opacity-0"
        }`}
      />
    </View>
  );
}
