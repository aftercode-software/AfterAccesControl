import React, { useContext, useState } from "react";
import { View, Text, Alert } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { AuthContext } from "@/context/AuthContext";
import { router } from "expo-router";
import { useToast } from "react-native-toast-notifications";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.show("Por favor, completa todos los campos.", {
        type: "danger",
        placement: "top",
      });
      return;
    }

    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast.show("Inicio de sesión exitoso.", {
          type: "success",
          placement: "top",
        });
        router.replace("/ingreso");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <View className="flex items-center justify-center h-full p-4">
        <View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <Text className="text-4xl font-bold text-center text-black mb-4">
            AfterAccess
          </Text>
          <Text className="text-center text-base mb-6">
            Inicia sesión con tu sucursal y contraseña{" "}
          </Text>
          <FormControl>
            <VStack space="lg">
              <VStack space="xs">
                <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100 active:border-[#F64C95]">
                  <InputField
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChangeText={setUsername}
                  />
                </Input>
              </VStack>
              <VStack space="xs">
                <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100">
                  <InputField
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                  />
                </Input>
              </VStack>
              <Button
                className="w-full h-14 bg-[#F64C95] rounded-lg mt-2 active:bg-[#D83E7F]"
                onPress={handleLogin}
                disabled={loading}
              >
                <ButtonText className="text-white text-lg font-bold">
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </ButtonText>
              </Button>
            </VStack>
          </FormControl>
        </View>
      </View>
    </GluestackUIProvider>
  );
}
