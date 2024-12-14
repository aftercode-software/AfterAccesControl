import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Slot, Stack } from "expo-router";
import { AuthProvider } from "./AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <GluestackUIProvider mode="dark">
        <Slot /> 
      </GluestackUIProvider>
    </AuthProvider>
  );
}
