import { Button, ButtonText } from "@/components/ui/button";
import { Link } from "expo-router";
import { View, Text } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuth } from "@/app/AuthContext";

export default function HomeScreen() {
  const { name } = useAuth();
  return (
    <GluestackUIProvider mode="light">
      <View>
        <Text className="text-3xl p-4 text-black">Home</Text>
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
        <Button size="md" variant="solid" action="primary">
          <ButtonText>{name}</ButtonText>
        </Button>
      </View>
    </GluestackUIProvider>
  );
}
