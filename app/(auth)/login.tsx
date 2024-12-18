import React, { useContext, useState } from "react";
import { View, Text, Alert } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../AuthContext";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const { setUser } = useContext(AuthContext) ?? {};
  if (!setUser) {
    throw new Error("AuthContext no está disponible.");
  }

  // Estados locales para usuario y contraseña
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("username", username, "password", password);
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

      const { message, token } = response.data.data;
      console.log("message", message, "token", token);
      // Guardar el token de forma segura
      await SecureStore.setItemAsync("userToken", token);
      console.log("token", token);
      // Actualizar el contexto con el usuario
      setUser({ username, token });
      console.log("username", username, "token", token);
      Alert.alert("Éxito", "Inicio de sesión exitoso.");
      router.replace("/home");
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
              <Text className="text-typography-500">Nombre de usuario</Text>
              <Input className="min-w-[250px]">
                <InputField
                  type="text"
                  value={username} // Asociamos el valor del estado
                  onChangeText={setUsername} // Actualizamos el estado
                  placeholder="Ingresa tu nombre de usuario"
                />
              </Input>
            </VStack>
            <VStack space="xs">
              <Text className="text-typography-500">Contraseña</Text>
              <Input className="min-w-[250px]">
                <InputField
                  type="password"
                  value={password} // Asociamos el valor del estado
                  onChangeText={setPassword} // Actualizamos el estado
                  placeholder="Ingresa tu contraseña"
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
