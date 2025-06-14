import { Pressable } from "react-native";
import React from "react";
import { TabIconProps } from "@/interfaces/tabIcon";

export default function TabIcon({ IconComponent, color }: TabIconProps) {
  return (
    <Pressable
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
      android_ripple={null}
    >
      <IconComponent color={color} />
    </Pressable>
  );
}
