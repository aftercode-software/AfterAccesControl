import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { View, Text, Alert, TouchableOpacity, Image } from "react-native";
export default function Salida() {
  return (
    <GluestackUIProvider mode="light">
      <View>
        <Text className="text-3xl p-4 text-black">Salida</Text>
      </View>
    </GluestackUIProvider>
  );
}
