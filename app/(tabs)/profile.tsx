import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { UserPen } from "lucide-react-native";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "react-native-toast-notifications";

export default function Profile() {
  const { user, logout } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      logout();
      toast.show("Sesión cerrada correctamente", {
        type: "success",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View className="w-full bg-white p-6 shadow-lg pt-20 items-center flex-1">
            <Text className="text-4xl mb-20 w-full font-bold text-left text-black font-inter">
              Perfil <UserPen color={"#000"} />
            </Text>

            <View className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Text className="text-4xl font-bold text-black font-inter">
                {user?.username?.charAt(0).toUpperCase()}
              </Text>
            </View>

            <Text className="text-2xl font-bold text-black mb-10 font-inter">
              {user?.username}
            </Text>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-slate-600 py-4 px-8 rounded-lg mt-auto mb-10"
              style={{ position: "absolute", bottom: 10, alignSelf: "center" }}
            >
              <Text className="text-lg font-bold text-white font-inter">
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </GluestackUIProvider>
  );
}
