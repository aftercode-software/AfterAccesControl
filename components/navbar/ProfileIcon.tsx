import { useAuth } from "@/hooks/useAuth";
import { Text, View } from "react-native";

export default function ProfileIcon() {
  const { user } = useAuth();
  return (
    <View className="h-[34px] w-[34px] items-center justify-center bg-ink">
      <Text className="font-inter-semibold text-[14px] text-white">
        {user?.username?.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
