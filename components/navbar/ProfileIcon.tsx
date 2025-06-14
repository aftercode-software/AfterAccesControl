import { useAuth } from "@/hooks/useAuth";
import { Text } from "react-native";

export default function ProfileIcon() {
  const { user } = useAuth();
  return (
    <Text
      className="text-xl w-10 h-10 text-white bg-[#78808B] rounded-full flex items-center justify-center text-center"
      style={{ fontFamily: "Poppins_500Medium", padding: 2, paddingTop: 6 }}
    >
      {user?.username?.charAt(0).toUpperCase()}
    </Text>
  );
}
