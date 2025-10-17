"use client";

import { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Toast } from "toastify-react-native";
import type { Movimiento } from "@/interfaces/interfaces";
import { getCurrentDateTimeInParaguay } from "@/utilities/dateTime";
import { ArrowRight, CloudAlert } from "lucide-react-native";
import { paymentTypes, popularBrands, vehicleTypes } from "@/constants/ingreso";
import { useData } from "@/hooks/useData";

export default function Ingreso() {
  const dataContext = useData();
  const { saveFormData, pendingData, retryPendingData } = dataContext;

  const [formData, setFormData] = useState({
    nombre: "",
    horaIngreso: "",
    cedula: "",
    marca: "",
    vehiculo: "",
    chapa: "",
    destino: "",
    fechaIngreso: "",
    monto: 0 as number | "",
    pago: "",
    boleta: "",
    observaciones: "",
  });

  const { currentDate, currentTime } = getCurrentDateTimeInParaguay();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const shouldShowMonto =
    formData.pago !== "boleta" &&
    formData.pago !== "falta pagar" &&
    formData.pago !== "";
  const shouldShowBoleta = formData.pago === "boleta";

  const handleSubmit = async () => {
    try {
      const camposObligatorios: (keyof typeof formData)[] = [
        "nombre",
        "cedula",
        "marca",
        "vehiculo",
        "chapa",
        "destino",
        "pago",
      ];

      if (formData.pago === "efectivo") {
        camposObligatorios.push("monto");
      }

      if (formData.pago === "boleta") {
        camposObligatorios.push("boleta");
      }

      for (const campo of camposObligatorios) {
        const valor = formData[campo];

        if (campo === "monto") {
          if (typeof valor !== "number" || valor <= 0) {
            Toast.warn(`El campo ${campo} es obligatorio y debe ser mayor a 0`);
            return;
          }
          continue;
        }

        if (typeof valor !== "string" || valor.trim() === "") {
          Toast.error(`El campo ${campo} es obligatorio`);
          return;
        }
      }

      formData.fechaIngreso = currentDate;
      formData.horaIngreso = currentTime;

      if (formData.pago === "falta pagar") {
        formData.monto = "";
      }

      await saveFormData(formData as Movimiento);
      setFormData({
        nombre: "",
        horaIngreso: "",
        cedula: "",
        marca: "",
        vehiculo: "",
        chapa: "",
        destino: "",
        fechaIngreso: "",
        monto: 0,
        pago: "",
        boleta: "",
        observaciones: "",
      });
    } catch (error) {
      console.error("Error al enviar datos:", error);
      Alert.alert("Error", "No se pudo enviar la información al servidor.");
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: "",
      horaIngreso: "",
      cedula: "",
      marca: "",
      vehiculo: "",
      chapa: "",
      destino: "",
      fechaIngreso: "",
      monto: 0,
      pago: "",
      boleta: "",
      observaciones: "",
    });
  };

  return (
    <GluestackUIProvider mode="light">
      <ScrollView nestedScrollEnabled scrollEnabled>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="w-full bg-white px-6 pt-6 pb-6">
            <View className="flex-row items-center justify-between mb-6">
              {pendingData.length > 0 && (
                <TouchableOpacity
                  onPress={() => retryPendingData()}
                  className="flex-row items-center bg-yellow-50 px-3 py-2 rounded-lg"
                >
                  <Text className="text-yellow-700 font-bold text-base mr-1">
                    {pendingData.length}
                  </Text>
                  <CloudAlert color="#a36b2f" size={20} />
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row items-center mb-2">
              <Text className="text-4xl font-bold text-black">Ingreso</Text>
            </View>
          </View>

          <View className="w-full bg-white px-6 pb-6">
            <FormControl>
              <VStack space="xl">
                <VStack space="md">
                  <Text className="text-base font-semibold text-black mb-2">
                    Datos personales
                  </Text>

                  <HStack space="md" className="w-full">
                    <VStack className="flex-1">
                      <Text className="text-sm font-medium px-1 pb-2 text-gray-700">
                        Chapa
                      </Text>
                      <TextInput
                        placeholder="ABC 1234"
                        value={formData.chapa}
                        onChangeText={(text) =>
                          handleInputChange("chapa", text)
                        }
                        style={{
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#d1d5db",
                          paddingHorizontal: 16,
                          height: 48,
                          fontSize: 14,
                          color: "#374151",
                          backgroundColor: "#fff",
                        }}
                      />
                    </VStack>

                    <VStack className="flex-1">
                      <Text className="text-sm font-medium px-1 pb-2 text-gray-700">
                        Cedula
                      </Text>
                      <TextInput
                        placeholder="9845751676"
                        value={formData.cedula}
                        onChangeText={(text) =>
                          handleInputChange("cedula", text)
                        }
                        keyboardType="numeric"
                        style={{
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#d1d5db",
                          paddingHorizontal: 16,
                          height: 48,
                          fontSize: 14,
                          color: "#374151",
                          backgroundColor: "#fff",
                        }}
                      />
                    </VStack>
                  </HStack>

                  <VStack>
                    <Text className="text-sm font-medium px-1 pb-2 text-gray-700">
                      Nombre
                    </Text>
                    <TextInput
                      placeholder="Juan Gonzalez"
                      value={formData.nombre}
                      onChangeText={(text) => handleInputChange("nombre", text)}
                      style={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#d1d5db",
                        paddingHorizontal: 16,
                        height: 48,
                        fontSize: 14,
                        color: "#374151",
                        backgroundColor: "#fff",
                      }}
                    />
                  </VStack>
                </VStack>

                <VStack space="md">
                  <Text className="text-base font-semibold text-black mb-2">
                    Datos vehículo
                  </Text>

                  <HStack space="md" className="w-full">
                    <VStack className="flex-1">
                      <Text className="text-sm font-medium px-1 pb-2 text-gray-700">
                        Vehiculo
                      </Text>
                      <View
                        style={{
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#d1d5db",
                          height: 48,
                          overflow: "hidden",
                          justifyContent: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Picker
                          selectedValue={formData.vehiculo}
                          onValueChange={(value) =>
                            handleInputChange("vehiculo", value)
                          }
                          style={{
                            width: "100%",
                            color: "#374151",
                            fontSize: 14,
                          }}
                        >
                          <Picker.Item label="Seleccione tipo" value="" />
                          {vehicleTypes.map((type) => (
                            <Picker.Item key={type} label={type} value={type} />
                          ))}
                        </Picker>
                      </View>
                    </VStack>

                    <VStack className="flex-1">
                      <Text className="text-sm font-medium px-1 pb-2 text-gray-700">
                        Marca
                      </Text>
                      <View
                        style={{
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#d1d5db",
                          height: 48,
                          overflow: "hidden",
                          justifyContent: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Picker
                          selectedValue={formData.marca}
                          onValueChange={(value) =>
                            handleInputChange("marca", value)
                          }
                          style={{
                            width: "100%",
                            color: "#374151",
                            fontSize: 14,
                          }}
                        >
                          <Picker.Item label="Seleccione marca" value="" />
                          {popularBrands.map((brand) => (
                            <Picker.Item
                              key={brand}
                              label={brand}
                              value={brand}
                            />
                          ))}
                        </Picker>
                      </View>
                    </VStack>
                  </HStack>
                </VStack>

                <VStack space="md">
                  <Text className="text-base font-semibold text-black mb-2">
                    Forma de pago y destino
                  </Text>

                  <HStack space="md" className="w-full">
                    <VStack className="flex-1">
                      <Text className="text-sm font-medium px-1 pb-2 text-gray-700">
                        Forma pago
                      </Text>
                      <View
                        style={{
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#d1d5db",
                          height: 48,
                          overflow: "hidden",
                          justifyContent: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Picker
                          selectedValue={formData.pago}
                          onValueChange={(value) => {
                            const resetData: Partial<typeof formData> = {
                              pago: value,
                            };

                            if (value !== "efectivo") {
                              resetData.monto = 0;
                            }

                            if (value !== "boleta") {
                              resetData.boleta = "";
                            }

                            setFormData({ ...formData, ...resetData });
                          }}
                          style={{
                            width: "100%",
                            color: "#374151",
                            fontSize: 14,
                          }}
                        >
                          <Picker.Item label="Seleccione una opción" value="" />
                          {paymentTypes.map((type) => (
                            <Picker.Item
                              key={type}
                              label={
                                type.charAt(0).toUpperCase() + type.slice(1)
                              }
                              value={type}
                            />
                          ))}
                        </Picker>
                      </View>
                    </VStack>

                    {shouldShowMonto && (
                      <VStack className="flex-1">
                        <Text className="text-sm font-medium px-1 pb-2 text-gray-700">
                          Monto ($)
                        </Text>
                        <TextInput
                          keyboardType="numeric"
                          placeholder="20000"
                          value={String(formData.monto)}
                          onChangeText={(text) =>
                            setFormData({
                              ...formData,
                              monto: Number(text),
                            })
                          }
                          style={{
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: "#d1d5db",
                            paddingHorizontal: 16,
                            height: 48,
                            fontSize: 14,
                            color: "#374151",
                            backgroundColor: "#fff",
                          }}
                        />
                      </VStack>
                    )}

                    {shouldShowBoleta && (
                      <VStack className="flex-1">
                        <Text className="text-sm font-medium px-1 pb-2 text-gray-700">
                          Boleta
                        </Text>
                        <TextInput
                          value={formData.boleta}
                          onChangeText={(text) =>
                            setFormData({ ...formData, boleta: text })
                          }
                          style={{
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: "#d1d5db",
                            paddingHorizontal: 16,
                            height: 48,
                            fontSize: 14,
                            color: "#374151",
                            backgroundColor: "#fff",
                          }}
                        />
                      </VStack>
                    )}
                  </HStack>

                  <VStack>
                    <Text className="text-sm font-medium px-1 pb-2 text-gray-700">
                      Destino
                    </Text>
                    <TextInput
                      placeholder="Finca 21 valle grande"
                      value={formData.destino}
                      onChangeText={(text) =>
                        handleInputChange("destino", text)
                      }
                      style={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#d1d5db",
                        paddingHorizontal: 16,
                        height: 48,
                        fontSize: 14,
                        color: "#374151",
                        backgroundColor: "#fff",
                      }}
                    />
                  </VStack>

                  <VStack>
                    <Text className="text-sm font-medium px-1 pb-2 text-gray-700">
                      Observaciones
                    </Text>
                    <TextInput
                      value={formData.observaciones}
                      onChangeText={(text) =>
                        setFormData({ ...formData, observaciones: text })
                      }
                      placeholder="Vehículo entra a las 12:33"
                      multiline
                      numberOfLines={3}
                      style={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#d1d5db",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        height: 80,
                        fontSize: 14,
                        color: "#374151",
                        backgroundColor: "#fff",
                        textAlignVertical: "top",
                      }}
                    />
                  </VStack>
                </VStack>

                <HStack space="md" className="w-full mt-4 mb-20">
                  <TouchableOpacity
                    onPress={handleCancel}
                    className="flex-1 h-14 bg-gray-200 rounded-lg items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-800 text-base font-semibold">
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="flex-1 h-14 bg-black rounded-lg items-center justify-center flex-row"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white text-base font-semibold mr-2">
                      Ingresar
                    </Text>
                    <ArrowRight color="#fff" size={20} />
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </FormControl>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </GluestackUIProvider>
  );
}
