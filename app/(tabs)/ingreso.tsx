import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { AuthContext } from "@/context/AuthContext";

export default function Ingreso() {
  const { user } = useContext(AuthContext) ?? {};
  const token = user?.token;
  console.log("Token:", token);

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
  const [chapas, setChapas] = useState<
    {
      chapa: string;
      nombre: string;
      cedula: string;
      marca: string;
      vehiculo: string;
    }[]
  >([]);
  const [query, setQuery] = useState("");
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  // Obtener chapas desde el servidor al cargar el componente
  useEffect(() => {
    const obtenerChapas = async () => {
      if (!token) {
        console.error("Error: Token no encontrado");
        Alert.alert("Error", "No estás autorizado. Por favor, inicia sesión nuevamente.");
        return;
      }

      try {
        const response = await axios.get<{
          chapa: string;
          nombre: string;
          cedula: string;
          marca: string;
          vehiculo: string;
        }[]>(
          "https://backend-afteraccess.vercel.app/buscar-chapa/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const chapasUnicas = Array.from(
          new Map(
            response.data.map((item) => [
              item.chapa,
              {
                chapa: item.chapa || "",
                nombre: item.nombre || "",
                cedula: item.cedula || "",
                marca: item.marca || "",
                vehiculo: item.vehiculo || "",
              },
            ])
          ).values()
        );

        setChapas(chapasUnicas); // Actualizamos el estado con chapas únicas
      } catch (error) {
        console.error("Error al obtener chapas:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          Alert.alert("Error", "No estás autorizado. Por favor, inicia sesión nuevamente.");
        } else {
          Alert.alert(
            "Error",
            "No se pudieron cargar las chapas desde el servidor. Verifica tu conexión."
          );
        }
      }
    };

    obtenerChapas();
  }, [token]);

  const filtrarChapas = (texto: string) => {
    setQuery(texto);
    setMostrarOpciones(true);
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
        horaIngreso: formData.horaIngreso,
        pago: formData.pago,
        monto: formData.monto,
        fechaIngreso: formData.fechaIngreso,
        destino: formData.destino,
      });
    }
    setQuery(valor);
    setMostrarOpciones(false);
  };

  const handleSubmit = async () => {
    // Validación de campos requeridos
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]?.trim() && key !== "monto") {
        Alert.alert("Error", `El campo ${key} es obligatorio.`);
        return;
      }
    }
  
    try {
      // Intentar enviar al servidor
      const response = await axios.post(
        "https://backend-afteraccess.vercel.app/movimiento",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        Alert.alert("Éxito", "Información enviada correctamente.");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      Alert.alert(
        "Error",
        "No se pudo enviar la información al servidor. Guardando localmente."
      );
    }
  
    try {
      // Guardar en almacenamiento local
      const localData = await AsyncStorage.getItem("vehiculosPendientes");
      const updatedData = localData
        ? [...JSON.parse(localData), formData]
        : [formData];
      await AsyncStorage.setItem(
        "vehiculosPendientes",
        JSON.stringify(updatedData)
      );
  
      // Restablecer el formulario
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
      <ScrollView nestedScrollEnabled>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="p-4"
        >
          <Text className="text-3xl mb-4">Formulario de Ingreso</Text>
          <FormControl>
            <VStack space="md">
              <VStack>
                <Text>Chapa</Text>
                <Input>
                  <InputField
                    placeholder="Ingresa la chapa"
                    value={query}
                    onFocus={() => setMostrarOpciones(true)}
                    onChangeText={filtrarChapas}
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
                      data={chapas.filter((item) =>
                        item.chapa.toLowerCase().includes(query.toLowerCase())
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
                          <Text>{item.chapa}</Text>
                        </TouchableOpacity>
                      )}
                      nestedScrollEnabled // Activar scroll anidado
                    />
                  </View>
                )}
              </VStack>

              {[...Object.keys(formData)]
                .filter((key) => !["chapa"].includes(key))
                .map((key) => (
                  <VStack key={key}>
                    <Text>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <Input>
                      <InputField
                        placeholder={`Ingresa ${key}`}
                        value={formData[key as keyof typeof formData]}
                        onChangeText={(text) =>
                          setFormData({ ...formData, [key]: text })
                        }
                      />
                    </Input>
                  </VStack>
                ))}

              <Button onPress={handleSubmit}>
                <ButtonText>Subir Información</ButtonText>
              </Button>
            </VStack>
          </FormControl>
        </KeyboardAvoidingView>
      </ScrollView>
    </GluestackUIProvider>
  );
}
