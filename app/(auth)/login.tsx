import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { AuthContext } from "@/context/AuthContext";
import BrandLogo from "@/components/ui/BrandLogo";
import Field from "@/components/ui/Field";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function Login() {
  const { login } = useContext(AuthContext);
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isButtonDisabled = !username.trim() || !password.trim();

  const handleLogin = async () => {
    if (isButtonDisabled || loading) return;

    setLoading(true);
    try {
      const success = await login(username.trim(), password);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-canvas"
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center px-[22px] py-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8 items-start">
          <BrandLogo className="h-[67px] w-[154px]" />
          <View className="mt-6 h-px w-full bg-line" />
        </View>

        <View className="mb-8">
          <Text className="font-inter-semibold text-[36px] leading-[39px] tracking-[-1.2px] text-ink">
            Iniciar sesión
          </Text>
          <Text className="mt-3 max-w-[340px] font-inter text-[15px] leading-[23px] text-slate">
            Ingresá tu usuario y contraseña para continuar con el registro.
          </Text>
        </View>

        <View className="gap-6">
          <Field
            autoCapitalize="none"
            autoCorrect={false}
            label="Usuario"
            onChangeText={setUsername}
            placeholder="Tu usuario"
            returnKeyType="next"
            value={username}
          />
          <Field
            autoCapitalize="none"
            autoCorrect={false}
            label="Contraseña"
            onChangeText={setPassword}
            onSubmitEditing={() => {
              void handleLogin();
            }}
            placeholder="Tu contraseña"
            returnKeyType="done"
            secureTextEntry
            value={password}
          />
          <PrimaryButton
            disabled={isButtonDisabled}
            loading={loading}
            onPress={() => {
              void handleLogin();
            }}
            className="mt-2"
          >
            Continuar
          </PrimaryButton>
        </View>

        <Text className="mt-8 font-inter-semibold text-[9px] tracking-[1px] text-slate-muted">
          ETRACK ACCESS / REGISTRO CLARO
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
