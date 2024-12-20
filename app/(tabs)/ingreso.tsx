import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useToast } from "react-native-toast-notifications";
import { Movimiento } from "@/interfaces/interfaces";
import { AuthContext } from "@/context/AuthContext";
import { getAllChapas } from "@/utilities/getChapas";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useData } from "@/context/DataContext";
import { router } from "expo-router";
import DropdownComponent from "@/components/Dropdown";
import CustomInput from "@/components/CustomInput";

const popularBrands = [
  "Audi",
  "BMW",
  "Chevrolet",
  "Citroën",
  "Dodge",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Isuzu",
  "Jeep",
  "Kia",
  "Land Rover",
  "Mazda",
  "Mercedes-Benz",
  "Mitsubishi",
  "Nissan",
  "Peugeot",
  "Renault",
  "Subaru",
  "Suzuki",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "Otra",
];

const vehicleTypes = ["transganado", "camion", "camioneta"];
const paymentTypes = ["efectivo", "boleta", "falta pagar"];

export default function Ingreso() {
  const [chapas, setChapas] = useState<Movimiento[]>([]);
  const toast = useToast();
  const dataContext = useData();
  const { saveFormData } = dataContext;
  const { user } = useContext(AuthContext) ?? {};
  const token = user?.token;

  const [formData, setFormData] = useState({
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [query, setQuery] = useState("");
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  useEffect(() => {
    const obtenerChapas = async () => {
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const chapas = await getAllChapas(token);
        if (chapas) {
          setChapas(chapas);
        }
      } catch (error: any) {
        toast.show("No se pudieron cargar las chapas.", {
          type: "danger",
          placement: "top",
        });
        console.error("Error al obtener chapas:", error);
      }
    };

    obtenerChapas();
  }, [token]);

  const chapasFiltradas: { label: string; value: string }[] = chapas
    .filter(
      (item) =>
        item.chapa.toLowerCase().includes(query.toLowerCase()) ||
        item.cedula.toLowerCase().includes(query.toLowerCase())
    )
    .map((item) => ({
      label: `${item.chapa} - ${item.cedula}`,
      value: item.chapa,
    }));

  const filtrarOpciones = (texto: string) => {
    setQuery(texto);
    setMostrarOpciones(true);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log("formData", formData);
  };

  const shouldShowMonto =
    formData.pago !== "boleta" &&
    formData.pago !== "falta pagar" &&
    formData.pago !== "";
  const shouldShowBoleta = formData.pago === "boleta";

  const handleDateChange = (_: unknown, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();

      const formattedDate = `${year}-${month}-${day}`;
      setFormData({ ...formData, fechaIngreso: formattedDate });
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (_: unknown, selectedTime: Date | undefined) => {
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setFormData({ ...formData, horaIngreso: formattedTime });
    }
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    console.log("formData", formData);
    try {
      const camposObligatorios: (keyof typeof formData)[] = [
        "nombre",
        "horaIngreso",
        "cedula",
        "marca",
        "vehiculo",
        "chapa",
        "destino",
        "fechaIngreso",
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

        if (typeof valor !== "string" || valor.trim() === "") {
          toast.show(`El campo ${campo} es obligatorio`, {
            type: "danger",
            placement: "top",
          });
          return;
        }
      }
      saveFormData(formData as Movimiento);
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

  const manejarSeleccionChapa = (valor: string) => {
    const chapaSeleccionada = chapas.find((item) => item.chapa === valor);
    if (chapaSeleccionada) {
      setFormData({
        ...formData,
        chapa: chapaSeleccionada.chapa,
        nombre: chapaSeleccionada.nombre,
        cedula: chapaSeleccionada.cedula,
        marca: chapaSeleccionada.marca,
        vehiculo: chapaSeleccionada.vehiculo,
        destino: formData.destino,
      });
    }
    setQuery(valor);
    setMostrarOpciones(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GluestackUIProvider mode="light">
        <ScrollView nestedScrollEnabled scrollEnabled={!mostrarOpciones}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="p-4"
          >
            <View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mx-auto pt-10">
              <Text className="text-4xl font-bold text-left text-black mb-4 font-inter">
                Ingreso
              </Text>
              <FormControl>
                <VStack space="lg">
                  <VStack className="flex-[2]">
                    <Text className="text-base font-medium text-gray-800 mb-2">
                      Buscar por Chapa o Cédula
                    </Text>

                    <Input className="w-full h-14 bg-gray-100 rounded-md border-primary border-2">
                      <InputField
                        placeholder="Ingresa chapa o cédula"
                        value={query}
                        onChangeText={filtrarOpciones}
                        className="text-lg"
                      />
                    </Input>

                    {mostrarOpciones && (
                      <FlatList
                        data={chapas.filter(
                          (item) =>
                            item.chapa
                              .toLowerCase()
                              .includes(query.toLowerCase()) ||
                            item.cedula
                              .toLowerCase()
                              .includes(query.toLowerCase())
                        )}
                        keyExtractor={(item) => item.chapa}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => manejarSeleccionChapa(item.chapa)}
                            className="p-4 border-b border-gray-300"
                          >
                            <Text className="text-gray-800 text-base font-medium">
                              {item.chapa} - {item.cedula}
                            </Text>
                          </TouchableOpacity>
                        )}
                        style={{
                          maxHeight: 150,
                          backgroundColor: "white",
                          elevation: 3,
                        }}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                      />
                    )}
                  </VStack>

                  <VStack>
                    <CustomInput
                      tittle="Chapa"
                      value={formData.chapa}
                      onChangeText={(text) => handleInputChange("chapa", text)}
                    />
                  </VStack>
                  {/* Campo de Edición Individual */}
                  <HStack space="lg" className="w-full">
                    <VStack className="flex-[1.4]">
                      <Text className="text-[1.0rem] font-bold text-gray-800  mb-1 font-inter">
                        Chapa
                      </Text>
                      <View className="w-full border rounded-xl focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-primary">
                        <TextInput
                          placeholder="Ingresa chapa"
                          value={formData.chapa}
                          onChangeText={(text) =>
                            setFormData({ ...formData, chapa: text })
                          }
                          className="w-full h-12 px-3 text-base text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none font-inter"
                        />
                      </View>
                    </VStack>

                    <VStack className="flex-[1.5]">
                      <Text className="text-base font-medium text-gray-800 mb-2">
                        Cédula
                      </Text>
                      <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100">
                        <InputField
                          placeholder="Ingresa la cédula"
                          value={formData.cedula}
                          onChangeText={(text) =>
                            setFormData({ ...formData, cedula: text })
                          }
                          className="text-lg"
                        />
                      </Input>
                    </VStack>
                  </HStack>

                  <VStack>
                    <Text className="text-base font-medium text-gray-800 mb-2">
                      Nombre
                    </Text>
                    <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100">
                      <InputField
                        placeholder="Nombre y apellido"
                        value={formData.nombre}
                        onChangeText={(text) =>
                          setFormData({ ...formData, nombre: text })
                        }
                      />
                    </Input>
                  </VStack>

                  <VStack>
                    <Text className="text-base font-medium text-gray-800 mb-2">
                      Destino
                    </Text>
                    <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100">
                      <InputField
                        placeholder="Destino"
                        value={formData.destino}
                        onChangeText={(text) =>
                          setFormData({ ...formData, destino: text })
                        }
                      />
                    </Input>
                  </VStack>

                  {/* Fecha y Hora de Ingreso */}
                  <HStack space="lg">
                    <VStack className="flex-[1]">
                      <Text className="text-base font-medium text-gray-800 mb-2">
                        Fecha de Ingreso
                      </Text>
                      <Button
                        onPress={() => setShowDatePicker(true)}
                        className="bg-gray-100 h-14 rounded-md"
                      >
                        <ButtonText className="text-gray-800 text-lg">
                          {formData.fechaIngreso || "Fecha"}
                        </ButtonText>
                      </Button>
                      {showDatePicker && (
                        <DateTimePicker
                          value={new Date()}
                          mode="date"
                          display="default"
                          onChange={handleDateChange}
                        />
                      )}
                    </VStack>
                    <VStack className="flex-[0.5]">
                      <Text className="text-base font-medium text-gray-800 mb-2">
                        Hora de Ingreso
                      </Text>
                      <Button
                        onPress={() => setShowTimePicker(true)}
                        className="bg-gray-100 h-14 rounded-md"
                      >
                        <ButtonText className="text-gray-800 text-lg">
                          {formData.horaIngreso || "Hora"}
                        </ButtonText>
                      </Button>
                      {showTimePicker && (
                        <DateTimePicker
                          value={new Date()}
                          mode="time"
                          display="default"
                          onChange={handleTimeChange}
                        />
                      )}
                    </VStack>
                  </HStack>

                  {/* Marca y Vehículo */}
                  <HStack space="lg" className="w-full">
                    <VStack className="flex-1">
                      <Text className="text-base font-medium text-gray-800 mb-2">
                        Vehículo
                      </Text>
                      <View className="bg-gray-100 h-14 rounded-md">
                        <Picker
                          selectedValue={formData.vehiculo}
                          onValueChange={(value) =>
                            setFormData({ ...formData, vehiculo: value })
                          }
                        >
                          <Picker.Item label="Vehiculo" value="" />
                          {vehicleTypes.map((type) => (
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
                    <VStack className="flex-1">
                      <Text className="text-base font-medium text-gray-800 mb-2">
                        Marca
                      </Text>
                      <View className="bg-gray-100 h-14 rounded-md">
                        <Picker
                          selectedValue={formData.marca}
                          onValueChange={(value) =>
                            setFormData({ ...formData, marca: value })
                          }
                          className="text-lg"
                        >
                          <Picker.Item label="Marca" value="" />
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

                  {/* Tipo de Pago y Campos Relacionados */}
                  <HStack space="lg">
                    <VStack className="flex-[0.5]">
                      <Text className="text-base font-medium text-gray-800 mb-2">
                        Tipo de Pago
                      </Text>
                      <View className="bg-gray-100 h-14 rounded-md">
                        <Picker
                          selectedValue={formData.pago}
                          onValueChange={(value) => {
                            const resetData: Partial<typeof formData> = {
                              pago: value,
                            };

                            if (value !== "Efectivo") {
                              resetData.monto = "";
                            }

                            if (value !== "Boleta") {
                              resetData.boleta = "";
                            }

                            setFormData({ ...formData, ...resetData });
                          }}
                        >
                          <Picker.Item label="Selecciona un tipo" value="" />
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
                      <VStack className="flex-[0.6]">
                        <Text className="text-base font-medium text-gray-800 mb-2">
                          Monto
                        </Text>
                        <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100">
                          <InputField
                            placeholder="Ingresa el monto"
                            value={formData.monto}
                            onChangeText={(text) =>
                              setFormData({ ...formData, monto: text })
                            }
                          />
                        </Input>
                      </VStack>
                    )}

                    {shouldShowBoleta && (
                      <VStack className="flex-[0.6]">
                        <Text className="text-base font-medium text-gray-800 mb-2">
                          Boleta
                        </Text>
                        <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100">
                          <InputField
                            placeholder="Ingresa la boleta"
                            value={formData.boleta}
                            onChangeText={(text) =>
                              setFormData({ ...formData, boleta: text })
                            }
                          />
                        </Input>
                      </VStack>
                    )}
                  </HStack>

                  <VStack>
                    <Text className="text-base font-medium text-gray-800 mb-2">
                      Observaciones
                    </Text>
                    <View className="w-full h-28 bg-gray-100 rounded-md border-gray-100">
                      <TextInput
                        placeholder="Escribe las observaciones aquí"
                        value={formData.observaciones}
                        onChangeText={(text) =>
                          setFormData({ ...formData, observaciones: text })
                        }
                        multiline
                        style={{
                          height: "100%",
                          padding: 10,
                          textAlignVertical: "top",
                          fontSize: 16,
                        }}
                      />
                    </View>
                  </VStack>

                  {/* Botón de Enviar */}
                  <Button
                    onPress={handleSubmit}
                    className="w-full h-14 bg-[#F64C95] rounded-lg mt-2 active:bg-[#D83E7F]"
                  >
                    <ButtonText className="text-white text-lg font-bold">
                      Subir Información
                    </ButtonText>
                  </Button>
                </VStack>
              </FormControl>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </GluestackUIProvider>
    </SafeAreaView>
  );
}
