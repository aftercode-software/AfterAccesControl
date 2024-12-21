import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ToastProvider } from "react-native-toast-notifications";
import { DataProvider } from "@/context/DataContext";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCheck, SquareX, TriangleAlert } from "lucide-react-native";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ToastProvider
        placement="top"
        offset={50}
        successColor="green"
        successIcon={<CheckCheck color={"#fff"} />}
        warningColor="orange"
        warningIcon={<TriangleAlert color={"#fff"} />}
        dangerColor="#a53333"
        dangerIcon={<SquareX color={"#fff"} className="pr-2" />}
      >
        <AuthProvider>
          <DataProvider>
            <GluestackUIProvider mode="light">
              <Slot />
            </GluestackUIProvider>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </SafeAreaView>
  );
}
