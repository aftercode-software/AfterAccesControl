import React, { useState, useContext } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";

export default function Ingreso() {
  const { user } = useContext(AuthContext) ?? {};
  const token = user?.token;

  const [formData, setFormData] = useState({
    tipo: "entrada", // fijo
    nombre: "",
    hora: "",
    cedula: "",
    marca: "",
    vehiculo: "",
    chapa: "",
    destino: "",
    fecha: "",
    boleta: "",
    pago: "",
    monto: "", // nuevo campo
    observaciones: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Validación básica
    for (const key in formData) {
      if (!formData[key as keyof typeof formData].trim() && key !== "monto") {
        Alert.alert("Error", `El campo ${key} es obligatorio.`);
        return;
      }
    }

    // Validar monto si pago es efectivo
    if (formData.pago === "efectivo" && !formData.monto.trim()) {
      Alert.alert("Error", "El campo monto es obligatorio cuando el pago es en efectivo.");
      return;
    }

    try {
      // Enviar al servidor
      const response = await axios.post(
        "https://backend-afteraccess.vercel.app/movimiento",
        { ...formData, monto: formData.monto || undefined }, // Excluir monto si está vacío
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Información enviada correctamente.");

        // Guardar localmente
        const localData = await AsyncStorage.getItem("vehiculosIngresados");
        const updatedData = localData
          ? [...JSON.parse(localData), formData]
          : [formData];
        await AsyncStorage.setItem("vehiculosIngresados", JSON.stringify(updatedData));

        // Limpiar formulario
        setFormData({
          tipo: "entrada",
          nombre: "",
          hora: "",
          cedula: "",
          marca: "",
          vehiculo: "",
          chapa: "",
          destino: "",
          fecha: "",
          boleta: "",
          pago: "",
          monto: "",
          observaciones: "",
        });
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      Alert.alert("Error", "No se pudo enviar la información. Verifica tu conexión a internet.");

      // Guardar en almacenamiento local si falla
      const localData = await AsyncStorage.getItem("vehiculosPendientes");
      const updatedData = localData
        ? [...JSON.parse(localData), formData]
        : [formData];
      await AsyncStorage.setItem("vehiculosPendientes", JSON.stringify(updatedData));
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <ScrollView>
        <View className="p-4">
          <Text className="text-3xl mb-4">Formulario de Ingreso</Text>
          <FormControl>
            <VStack space="md">
              {/* Renderizar los campos dinámicamente */}
              {Object.keys(formData).map((key) => {
                // Ocultar el campo monto si el pago no es efectivo
                if (key === "monto" && formData.pago !== "efectivo") return null;

                return (
                  <VStack key={key}>
                    <Text>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <Input>
                      <InputField
                        placeholder={`Ingresa ${key}`}
                        keyboardType={key === "monto" || key === "cedula" ? "numeric" : "default"}
                        value={formData[key as keyof typeof formData]}
                        onChangeText={(text) => handleChange(key, text)}
                      />
                    </Input>
                  </VStack>
                );
              })}

              <Button onPress={handleSubmit}>
                <ButtonText>Subir Información</ButtonText>
              </Button>
            </VStack>
          </FormControl>
        </View>
      </ScrollView>
    </GluestackUIProvider>
  );
}
