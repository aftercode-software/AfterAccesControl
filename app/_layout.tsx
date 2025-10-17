import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ToastProvider } from "react-native-toast-notifications";
import { DataProvider } from "@/context/DataContext";
import * as SplashScreen from "expo-splash-screen";
import { RootSiblingParent } from "react-native-root-siblings";
import ToastManager from "toastify-react-native";
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

SplashScreen.preventAutoHideAsync();

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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <RootSiblingParent>
      <SafeAreaView style={{ flex: 1 }}>
        <ToastManager />
        <AuthProvider>
          <DataProvider>
            <GluestackUIProvider mode="light">
              <Slot />
            </GluestackUIProvider>
          </DataProvider>
        </AuthProvider>
      </SafeAreaView>
    </RootSiblingParent>
  );
}
