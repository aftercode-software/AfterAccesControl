"use client";

import { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { AuthContext } from "@/context/AuthContext";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";

import { getAxiosErrorMessage } from "@/utilities/axiosError";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(!(username.trim() && password.trim()));
  }, [username, password]);

  const handleLogin = async () => {
    if (isButtonDisabled) return;

    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        Toast.success("Bienvenido");
        router.replace("/ingreso");
      }
    } catch (error) {
      console.log("Error en handleLogin:", error);
      const msg = getAxiosErrorMessage(error);

      Toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "white" }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: 24,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="w-full max-w-sm self-center">
              <View className="flex flex-row mb-10 justify-center">
                <Image
                  source={require("../../assets/logo-black.png")}
                  className="w-20 h-20"
                  resizeMode="contain"
                />
              </View>

              <Text className="text-3xl font-bold text-center text-black mb-2 font-inter">
                Iniciar Sesión
              </Text>

              <Text className="text-center text-sm text-gray-600 mb-10 font-inter">
                Ingresá tu usuario
              </Text>

              <FormControl>
                <VStack space="lg">
                  <VStack space="xs">
                    <Text className="text-sm font-medium text-black mb-1 font-inter">
                      Usuario
                    </Text>
                    <Input className="w-full h-14 bg-white rounded-lg border border-gray-300 font-inter">
                      <InputField
                        placeholder="Usuario"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onSubmitEditing={() => Keyboard.dismiss()}
                      />
                    </Input>
                  </VStack>

                  <VStack space="xs">
                    <Text className="text-sm font-medium text-black mb-1 font-inter">
                      Contraseña
                    </Text>
                    <Input className="w-full h-14 bg-white rounded-lg border border-gray-300 font-inter">
                      <InputField
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                      />
                    </Input>
                  </VStack>

                  <Button
                    className="w-full h-14 bg-black rounded-lg mt-4 disabled:bg-gray-400 active:bg-gray-800"
                    onPress={handleLogin}
                    disabled={isButtonDisabled || loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <ButtonText className="text-white text-base font-semibold font-inter">
                        Continuar
                      </ButtonText>
                    )}
                  </Button>
                </VStack>
              </FormControl>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GluestackUIProvider>
  );
}
