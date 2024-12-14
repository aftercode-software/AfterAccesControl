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

  const emailRef = useRef<string>(""); // Referencia para el email
  const passwordRef = useRef<string>(""); // Referencia para la contraseña
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const email = emailRef.current.trim();
    const password = passwordRef.current.trim();

    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend-afteraccess.vercel.app/login",
        { email, password }
      );

      const { id, token } = response.data;

      // Guardar el token de forma segura
      await SecureStore.setItemAsync("userToken", token);

      // Actualizar el contexto con el usuario
      setUser({ id, email, token });
      Alert.alert("Éxito", "Inicio de sesión exitoso.");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "No se pudo iniciar sesión. Verifica tus credenciales.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <View className="flex items-center justify-center h-full">
        <FormControl className="p-4 border rounded-lg border-outline-300">
          <VStack space="xl">
            <VStack space="xs">
              <Text className="text-typography-500">Email</Text>
              <Input className="min-w-[250px]">
                <InputField
                  type="text"
                  onChangeText={(text) => (emailRef.current = text)}
                  placeholder="Ingresa tu email"
                />
              </Input>
            </VStack>
            <VStack space="xs">
              <Text className="text-typography-500">Password</Text>
              <Input className="min-w-[250px]">
                <InputField
                  type="password"
                  onChangeText={(text) => (passwordRef.current = text)}
                  placeholder="Ingresa tu contraseña"
                />
              </Input>
            </VStack>
            <Button
              className="ml-auto"
              onPress={handleLogin}
              disabled={loading}
            >
              <ButtonText className="text-typography-0">
                {loading ? "Cargando..." : "Iniciar sesión"}
              </ButtonText>
            </Button>
          </VStack>
        </FormControl>
      </View>
    </GluestackUIProvider>
  );
}
