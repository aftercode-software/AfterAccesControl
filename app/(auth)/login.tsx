import React, { useContext, useState } from "react";
import { View, Text, Alert, TouchableOpacity, Image } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "@/context/AuthContext";
import { router } from "expo-router";

export default function Login() {
  const { setUser } = useContext(AuthContext) ?? {};
  if (!setUser) {
    throw new Error("AuthContext no está disponible.");
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend-afteraccess.vercel.app/login",
        { username, password }
      );
      console.log("response", response);

      Alert.alert("Éxito", `Bienvenido, ${username}!`);
      const { token } = response.data;
      console.log("token", token);
      await SecureStore.setItemAsync("userToken", String(token));

      setUser({ username, token });
      router.replace("/home");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Inicio de sesión fallido. Por favor, verifica tu usuario y contraseña.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <View className="flex items-center justify-center h-full p-4">
        <View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          {/* <View className="flex items-center justify-center mb-20">
            <Image
              source={require("@/assets/logo.png")}
              className="w-48 h-auto"
              resizeMode="contain"
            />
          </View> */}
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
