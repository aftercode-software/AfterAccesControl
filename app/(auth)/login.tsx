import React, { useContext, useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlHelperText,
  FormControlHelper,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { AuthContext } from "@/context/AuthContext";
import { router } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { AlertCircleIcon } from "@/components/ui/icon";
import { globalStyles } from "@/styles/globalStyles";
import Logo from "@/components/login/Logo";

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
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado durante el inicio de sesión.";

      toast.show(errorMessage, {
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex items-center justify-center h-full ">
      <VStack className="w-full max-w-md bg-white px-8 ">
        <Logo />
        <Text
          className="text-3xl text-center text-black mb-2"
          style={{ fontFamily: "Poppins_600SemiBold" }}
        >
          Iniciar Sesión
        </Text>
        <Text
          className="text-center text-[#212427] mb-6"
          style={{ fontFamily: "Poppins_400Regular" }}
        >
          Ingresá tu usuario y contraseña
        </Text>

        <FormControl className="mt-10">
          <VStack space="lg">
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText>Usuario</FormControlLabelText>
              </FormControlLabel>
              <Input className="w-full h-14">
                <InputField
                  placeholder="usuario"
                  value={username}
                  type="text"
                  onChangeText={setUsername}
                  returnKeyType="done"
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText>Contraseña</FormControlLabelText>
              </FormControlLabel>
              <Input className="w-full h-14">
                <InputField
                  placeholder="contraseña"
                  secureTextEntry={true}
                  value={password}
                  type="password"
                  onChangeText={setPassword}
                  onSubmitEditing={handleLogin}
                  returnKeyType="done"
                />
              </Input>
            </VStack>

            <Button
              className="w-full h-14 bg-black rounded-xl mt-4 disabled:bg-gray-500 active:bg-gray-700"
              onPress={handleLogin}
              disabled={isButtonDisabled || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <ButtonText
                  className="text-white text-lg"
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                >
                  Continuar
                </ButtonText>
              )}
            </Button>
          </VStack>
        </FormControl>
      </VStack>
    </View>
  );
}

{
  /* <View className="flex items-center justify-center h-full p-4">
<View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
  <Text className="text-4xl font-bold text-center text-black mb-4 ">
    AfterAccess
  </Text>
  <Text className="text-center text-base mb-6 ">
    Inicia sesión con tu sucursal y contraseña
  </Text>
  <FormControl>
    <VStack space="lg">
      <VStack space="xs">
        <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100 ">
          <InputField
            type="text"
            placeholder="Usuario"
            value={username}
            onChangeText={setUsername}
          />
        </Input>
      </VStack>
      <VStack space="xs">
        <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100 ">
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
          <ButtonText className="text-white text-lg font-bold ">
            Iniciar Sesión
          </ButtonText>
        )}
      </Button>
    </VStack>
  </FormControl>
</View>
</View> */
}
