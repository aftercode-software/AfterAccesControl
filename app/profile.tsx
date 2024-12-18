import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { View, Text, Alert, TouchableOpacity, Image } from "react-native";
export default function Profile() {
  return (
    <GluestackUIProvider mode="light">
      <View>
        <Text className="text-3xl p-4 text-black">Profile</Text>
      </View>
    </GluestackUIProvider>
  );
}
