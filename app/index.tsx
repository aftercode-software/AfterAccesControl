import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import BrandLogo from "@/components/ui/BrandLogo";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/styles/tokens";

export default function Index() {
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !loading) {
      router.replace(user ? "/ingreso" : "/login");
    }
  }, [isMounted, loading, user]);

  return (
    <View className="flex-1 items-center justify-center bg-canvas">
      <BrandLogo className="h-[74px] w-[170px]" />
      <View className="mt-6">
        <ActivityIndicator color={colors.amberDeep} size="small" />
      </View>
    </View>
  );
}
