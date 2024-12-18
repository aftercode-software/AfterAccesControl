import React, { useRef, useContext, useState } from "react";
import { View, Text, Alert } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../AuthContext";

export default function Login() {
  const { setUser } = useContext(AuthContext) ?? {};
  if (!setUser) {
    throw new Error("AuthContext no está disponible.");
  }

  const usernameRef = useRef<string>(""); // Referencia para el nombre de usuario
  const passwordRef = useRef<string>(""); // Referencia para la contraseña
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const username = usernameRef.current.trim();
    const password = passwordRef.current.trim();

    if (!username || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend-afteraccess.vercel.app/login",
        { username, password }
      );

      Alert.alert(response.data.message);
      const { id, token } = response.data;

      // Guardar el token de forma segura
      await SecureStore.setItemAsync("userToken", token);

      // Actualizar el contexto con el usuario
      setUser({ id, username, token });
      Alert.alert("Éxito", "Inicio de sesión exitoso.");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "No se pudo iniciar sesión. Verifica tus credenciales.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <View className="flex items-center justify-center h-full p-6">
        <FormControl className="w-full max-w-lg p-6 border rounded-lg border-outline-300">
          <VStack space="xl">
            <VStack space="xs">
              <Text className="text-2xl font-semibold text-typography-500">
                Username
              </Text>
              <Input className="w-full min-h-12">
                <InputField
                  type="text"
                  placeholder="Ingresa tu nombre de usuario"
                  onChangeText={(text) => (usernameRef.current = text)}
                />
              </Input>
            </VStack>
            <VStack space="xs">
              <Text className="text-2xl font-semibold text-typography-500">
                Password
              </Text>
              <Input className="w-full min-h-12">
                <InputField
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  onChangeText={(text) => (passwordRef.current = text)}
                />
              </Input>
            </VStack>
            <Button
              className="w-full py-4 mt-4 min-h-16"
              onPress={handleLogin}
              disabled={loading}
            >
              <ButtonText className="text-xl font-bold text-typography-0">
                {loading ? "Cargando..." : "Iniciar sesión"}
              </ButtonText>
            </Button>
          </VStack>
        </FormControl>
      </View>
    </GluestackUIProvider>
  );
}
