
import React from "react";
import { View, Text } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <GluestackUIProvider mode="light">
      <View className="flex items-center justify-center h-full">
        <VStack space="xl">
          <Text className="text-3xl text-center">Inicio</Text>
          <Button
            onPress={() => router.push("/ingreso")}
            className="bg-green-500"
          >
            <ButtonText>Ingreso</ButtonText>
          </Button>
          <Button
            onPress={() => router.push("/egreso")}
            className="bg-red-500"
          >
            <ButtonText>Egreso</ButtonText>
          </Button>
        </VStack>
      </View>
    </GluestackUIProvider>
  );
}
