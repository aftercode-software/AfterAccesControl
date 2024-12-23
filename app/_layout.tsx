import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ToastProvider } from "react-native-toast-notifications";
import { DataProvider } from "@/context/DataContext";
import * as SplashScreen from "expo-splash-screen";
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

// Prevenir que el Splash Screen se oculte automáticamente
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
      SplashScreen.hideAsync(); // Oculta el Splash Screen cuando las fuentes estén cargadas
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Mostrar nada hasta que las fuentes estén listas
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
