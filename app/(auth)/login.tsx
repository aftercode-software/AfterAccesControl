import React, { useContext, useState, useEffect } from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const toast = useToast();

  useEffect(() => {
    setIsButtonDisabled(!(username.trim() && password.trim()));
  }, [username, password]);

  const handleLogin = async () => {
    if (isButtonDisabled) return;

    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        toast.show("Inicio exitoso", {
          type: "success",
          placement: "top",
        });
        router.replace("/ingreso");
      }
    } catch (error) {
      toast.show(error.message, {
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <View className="flex items-center justify-center h-full p-4">
        <View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <Text className="text-4xl font-bold text-center text-black mb-4 font-inter">
            AfterAccess
          </Text>
          <Text className="text-center text-base mb-6 font-inter">
            Inicia sesión con tu sucursal y contraseña
          </Text>
          <FormControl>
            <VStack space="lg">
              <VStack space="xs">
                <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100 font-inter">
                  <InputField
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChangeText={setUsername}
                  />
                </Input>
              </VStack>
              <VStack space="xs">
                <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100 font-inter">
                  <InputField
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    onSubmitEditing={handleLogin}
                    returnKeyType="done"
                  />
                </Input>
              </VStack>
              <Button
                className="w-full h-14 bg-[#F64C95] rounded-lg mt-2 disabled:bg-slate-600 active:bg-[#D83E7F]"
                onPress={handleLogin}
                disabled={isButtonDisabled || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <ButtonText className="text-white text-lg font-bold font-inter">
                    Iniciar Sesión
                  </ButtonText>
                )}
              </Button>
            </VStack>
          </FormControl>
        </View>
      </View>
    </GluestackUIProvider>
  );
}
