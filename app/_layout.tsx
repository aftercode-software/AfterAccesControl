import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Slot, Stack } from "expo-router";
import { View, Text } from "react-native";


export default function Layout() {


  return (
    <GluestackUIProvider mode="dark">
      <Stack/>
    </GluestackUIProvider>
  )
}