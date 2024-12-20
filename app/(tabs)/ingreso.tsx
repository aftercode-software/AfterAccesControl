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
import axios from "axios";

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
  "Otros",
];

const vehicleTypes = ["Transganado", "Camion", "Camioneta"];
const paymentTypes = ["Efectivo", "Boleta", "Falta pagar"];

export default function Ingreso() {
  const [chapas, setChapas] = useState<Movimiento[]>([]);
  const toast = useToast();
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
    monto: "",
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
        console.warn("Token no disponible. No se pueden cargar las chapas.");
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

  const filtrarOpciones = (texto: string) => {
    setQuery(texto);
    setMostrarOpciones(true);
  };

  const shouldShowMonto =
    formData.pago !== "Boleta" &&
    formData.pago !== "Falta pagar" &&
    formData.pago !== "";
  const shouldShowBoleta = formData.pago === "Boleta";

  const handleDateChange = (_: unknown, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("es-ES");
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
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]?.trim() && key !== "monto") {
        if (key === "horaIngreso") {
          toast.show("El cammpo hora es obligatorio", {
            type: "danger",
            placement: "top",
          });
          return;
        }
        if (key === "fechaIngreso") {
          toast.show("El campo fecha es obligatorio", {
            type: "danger",
            placement: "top",
          });
        }
        toast.show(`El campo ${key} es obligatorio`, {
          type: "danger",
          placement: "top",
        });

        return;
      }
    }
    try {
      console.log("Enviando datos:", formData);
      // const response = await axios.post(
      //   "https://backend-afteraccess.vercel.app/movimiento",
      //   formData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      Alert.alert("Éxito", "Formulario enviado correctamente.");
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

  const saveLocalStorage = async () => {
    try {
      const localData = await AsyncStorage.getItem("vehiculosPendientes");
      const updatedData = localData
        ? [...JSON.parse(localData), formData]
        : [formData];
      await AsyncStorage.setItem(
        "vehiculosPendientes",
        JSON.stringify(updatedData)
      );

      setFormData({
        nombre: "",
        horaIngreso: "",
        cedula: "",
        marca: "",
        vehiculo: "",
        chapa: "",
        destino: "",
        fechaIngreso: "",
        monto: "",
        pago: "",
        boleta: "",
        observaciones: "",
      });

      setQuery("");
      setMostrarOpciones(false);
    } catch (error) {
      console.error("Error al guardar datos localmente:", error);
      Alert.alert("Error", "No se pudo guardar la información localmente.");
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <ScrollView nestedScrollEnabled scrollEnabled={!mostrarOpciones}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="p-4"
        >
          <View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mx-auto">
            <Text className="text-4xl font-bold text-center text-black mb-4">
              Formulario de Ingreso
            </Text>
            <FormControl>
              <VStack space="lg">
                <VStack className="flex-[2] ">
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
                    <View
                      style={{
                        maxHeight: 150,
                        backgroundColor: "white",
                        elevation: 3,
                      }}
                    >
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
                            style={{
                              padding: 10,
                              borderBottomWidth: 1,
                              borderColor: "#ddd",
                            }}
                          >
                            <Text>
                              {item.chapa} - {item.cedula}
                            </Text>
                          </TouchableOpacity>
                        )}
                        nestedScrollEnabled
                      />
                    </View>
                  )}
                </VStack>

                {/* Campo de Edición Individual */}
                <HStack space="lg" className="w-full">
                  <VStack className="flex-[1.4]">
                    <Text className="text-base font-medium text-gray-800 mb-2">
                      Chapa
                    </Text>
                    <Input className="w-full h-14 bg-gray-100 rounded-md border-gray-100">
                      <InputField
                        placeholder="Ingresa chapa"
                        value={formData.chapa}
                        onChangeText={(text) =>
                          setFormData({ ...formData, chapa: text })
                        }
                        className="text-lg"
                      />
                    </Input>
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
                          <Picker.Item key={type} label={type} value={type} />
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
                        onValueChange={(value) =>
                          setFormData({ ...formData, pago: value })
                        }
                      >
                        <Picker.Item label="Selecciona un tipo" value="" />
                        {paymentTypes.map((type) => (
                          <Picker.Item key={type} label={type} value={type} />
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
  );
}
