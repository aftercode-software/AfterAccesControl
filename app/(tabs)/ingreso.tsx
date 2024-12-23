import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useToast } from "react-native-toast-notifications";
import { Movimiento } from "@/interfaces/interfaces";
import { AuthContext } from "@/context/AuthContext";
import { getAllChapas } from "@/utilities/getChapas";
import { useData } from "@/context/DataContext";
import { router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomPicker from "@/components/CustomPicker";
import { getCurrentDateTimeInParaguay } from "@/utilities/dateTime";
import { ArrowDown, CloudAlert, Search } from "lucide-react-native";
import BuscadorChapa from "@/components/BuscadorChapa";
import { paymentTypes, popularBrands, vehicleTypes } from "@/constants/ingreso";

export default function Ingreso() {
  const [chapas, setChapas] = useState<Movimiento[]>([]);
  const toast = useToast();
  const dataContext = useData();
  const { saveFormData, pendingData, retryPendingData } = dataContext;
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

  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const { currentDate, currentTime } = getCurrentDateTimeInParaguay();

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
        toast.show("No se pudieron cargar las chapas", {
          type: "danger",
          placement: "top",
        });
        console.error("Error al obtener chapas:", error);
      }
    };

    obtenerChapas();
  }, [token]);

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
            toast.show(
              `El campo ${campo} es obligatorio y debe ser mayor a 0`,
              {
                type: "danger",
                placement: "top",
              }
            );
            return;
          }
          continue;
        }

        if (typeof valor !== "string" || valor.trim() === "") {
          toast.show(`El campo ${campo} es obligatorio`, {
            type: "danger",
            placement: "top",
          });
          return;
        }
      }

      formData.fechaIngreso = currentDate;
      formData.horaIngreso = currentTime;

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

    setMostrarOpciones(false);
  };

  return (
    <GluestackUIProvider mode="light">
      <ScrollView nestedScrollEnabled scrollEnabled={!mostrarOpciones}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className=""
        >
          <View className="w-full bg-white p-6 shadow-lg pt-20">
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
                justifyContent: "space-between",
              }}
            >
              <Text className="text-4xl mb-6 font-bold text-left text-black font-inter">
                Ingreso
                <ArrowDown color="#000" />
              </Text>

              {pendingData.length > 0 && (
                <View
                  onTouchEnd={() => retryPendingData()}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 8,
                    backgroundColor: "#fdf6b2",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 10,
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      color: "#a36b2f",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginRight: 4,
                    }}
                  >
                    {pendingData.length}
                  </Text>
                  <CloudAlert color="#a36b2f" />
                </View>
              )}
            </View>

            <FormControl>
              <VStack space="lg">
                <HStack className="flex-1 items-start">
                  <BuscadorChapa
                    chapas={chapas}
                    manejarSeleccionChapa={manejarSeleccionChapa}
                  />
                  <Search
                    width={30}
                    height={30}
                    color={"#F64C95"}
                    style={{ marginTop: 32, marginLeft: 5 }}
                  />
                </HStack>

                <HStack space="lg" className="w-full">
                  <CustomInput
                    tittle="Chapa"
                    value={formData.chapa}
                    onChangeText={(text) => handleInputChange("chapa", text)}
                  />
                  <CustomInput
                    tittle="Cedula"
                    value={formData.cedula}
                    onChangeText={(text) => handleInputChange("cedula", text)}
                  />
                </HStack>

                <VStack>
                  <CustomInput
                    tittle="Nombre"
                    placeholder="Nombre y apellido"
                    value={formData.nombre}
                    onChangeText={(text) => handleInputChange("nombre", text)}
                  />
                </VStack>

                <VStack>
                  <CustomInput
                    tittle="Destino"
                    value={formData.destino}
                    onChangeText={(text) => handleInputChange("destino", text)}
                  />
                </VStack>

                <HStack space="lg" className="w-full">
                  <CustomPicker
                    arrayOpciones={vehicleTypes}
                    tittle="Vehiculo"
                    value={formData.vehiculo}
                    onChangeText={(text) => handleInputChange("vehiculo", text)}
                  />
                  <CustomPicker
                    arrayOpciones={popularBrands}
                    tittle="Marca"
                    value={formData.marca}
                    onChangeText={(text) => handleInputChange("marca", text)}
                  />
                </HStack>

                <HStack space="lg">
                  <VStack className="flex-[0.5]">
                    <Text className="text-sm font-bold px-1 pb-1 text-gray-800 font-inter">
                      Forma pago
                    </Text>
                    <View
                      style={{
                        borderRadius: 10,
                        borderWidth: 1.5,
                        borderColor: "#ccc",
                        height: 50,
                        overflow: "hidden",
                        justifyContent: "center",
                      }}
                    >
                      <Picker
                        selectedValue={formData.pago}
                        onValueChange={(value) => {
                          const resetData: Partial<typeof formData> = {
                            pago: value,
                          };

                          if (value !== "Efectivo") {
                            resetData.monto = 0;
                          }

                          if (value !== "Boleta") {
                            resetData.boleta = "";
                          }

                          setFormData({ ...formData, ...resetData });
                        }}
                        style={{
                          width: "100%",
                          color: "#333",
                          fontSize: 14,
                        }}
                        itemStyle={{
                          fontSize: 14,
                        }}
                      >
                        <Picker.Item
                          label={"Seleccione una opción"}
                          value=""
                          style={{ color: "#888" }}
                        />
                        {paymentTypes.map((type) => (
                          <Picker.Item
                            key={type}
                            label={type.charAt(0).toUpperCase() + type.slice(1)}
                            value={type}
                          />
                        ))}
                      </Picker>
                    </View>
                  </VStack>

                  {shouldShowMonto && (
                    <VStack className="flex-[0.5] space-y-1">
                      <Text className="text-sm font-bold px-1 pb-1 text-gray-800 font-inter">
                        Monto
                      </Text>
                      <View className="w-full h-14">
                        <TextInput
                          keyboardType="numeric"
                          placeholder="Ingresa el monto"
                          value={String(formData.monto)}
                          onChangeText={(text) =>
                            setFormData({
                              ...formData,
                              monto: Number(text),
                            })
                          }
                          style={{
                            borderRadius: 10,
                            borderWidth: 1.5,
                            borderColor: "#ccc",
                            paddingHorizontal: 16,
                            height: "100%",
                            fontSize: 14,
                            color: "#333",
                          }}
                          className="w-full h-full"
                        />
                      </View>
                    </VStack>
                  )}

                  {shouldShowBoleta && (
                    <VStack className="flex-[0.5]">
                      <Text className="text-sm font-bold px-1 pb-1 text-gray-800 font-inter">
                        Boleta
                      </Text>
                      <View className="w-full h-14">
                        <TextInput
                          value={formData.boleta}
                          onChangeText={(text) =>
                            setFormData({ ...formData, boleta: text })
                          }
                          style={{
                            borderRadius: 10,
                            borderWidth: 1.5,
                            borderColor: "#ccc",
                          }}
                          className="w-full h-14 px-4 text-base"
                        />
                      </View>
                    </VStack>
                  )}
                </HStack>

                <VStack>
                  <Text className="text-sm font-bold px-1 pb-1 text-gray-800 font-inter">
                    Observaciones
                  </Text>
                  <View
                    className="w-full h-28 bg-gray-100 rounded-md border-gray-100 "
                    style={{
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: "#ccc",
                    }}
                  >
                    <TextInput
                      value={formData.observaciones}
                      onChangeText={(text) =>
                        setFormData({ ...formData, observaciones: text })
                      }
                      multiline
                      className="w-full px-4 text-base"
                    />
                  </View>
                </VStack>

                <Button
                  onPress={handleSubmit}
                  className="w-full h-14 bg-[#F64C95] rounded-lg mt-2 active:bg-[#D83E7F]"
                >
                  <ButtonText className="text-white text-lg font-bold">
                    Ingresar
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
