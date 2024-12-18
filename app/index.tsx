import { Button, ButtonText } from "@/components/ui/button";
import { Link } from "expo-router";
import { View, Text } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function HomeScreen() {
  return (
    <GluestackUIProvider mode="light">
      <View>
        <Text className="text-3xl p-4 text-black">Home</Text>
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
        <Button size="md" variant="solid" action="primary">
          <ButtonText>nashe</ButtonText>
        </Button>
      </View>
    </GluestackUIProvider>
  );
}
