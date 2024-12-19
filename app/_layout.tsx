import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ToastProvider } from "react-native-toast-notifications";

export default function Layout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <GluestackUIProvider mode="light">
          <Slot />
        </GluestackUIProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
