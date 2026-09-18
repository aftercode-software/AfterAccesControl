import React from "react";
import { View } from "react-native";
import BrandLogo from "@/components/ui/BrandLogo";
import ConnectionPill from "@/components/ui/ConnectionPill";
import PendingData from "./PendingData";
import { useData } from "@/hooks/useData";

export default function Header() {
  const { connectionStatus } = useData();

  return (
    <View className="h-[70px] flex-row items-center justify-between border-b border-line bg-canvas px-[22px]">
      <BrandLogo className="h-[44px] w-[100px]" />
      <View className="flex-row items-center gap-2">
        <ConnectionPill status={connectionStatus} />
        <PendingData />
      </View>
    </View>
  );
}
