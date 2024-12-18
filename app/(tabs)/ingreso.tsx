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

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const obtenerChapas = () => {
      const dataSimulada = [
        {
          chapa: "ABC123",
          nombre: "Juan Pérez",
          cedula: "12345678",
          marca: "Ford",
          vehiculo: "Camión",
        },
        {
          chapa: "ABC123",
          nombre: "Juan Pérez",
          cedula: "12345678",
          marca: "Ford",
          vehiculo: "Camión",
        },
        {
          chapa: "DEF456",
          nombre: "Carlos López",
          cedula: "87654321",
          marca: "Toyota",
          vehiculo: "Camioneta",
        },
        {
          chapa: "GHI789",
          nombre: "Ana Gómez",
          cedula: "11223344",
          marca: "Chevrolet",
          vehiculo: "Transganado",
        },
      ];

      const chapasUnicas = Array.from(
        new Map(dataSimulada.map((item) => [item.chapa, item])).values()
      );

      setChapas(chapasUnicas);
    };

    obtenerChapas();
  }, []);

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
      });
    }
    setQuery(valor);
    setMostrarOpciones(false);
  };

  const handleSubmit = async () => {
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]?.trim()) {
        Alert.alert("Error", `El campo ${key} es obligatorio.`);
        return;
      }
    }

    if (formData.pago === "efectivo" && !formData.monto.trim()) {
      Alert.alert(
        "Error",
        "El campo monto es obligatorio cuando el pago es en efectivo."
      );
      return;
    }

    try {
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

        const localData = await AsyncStorage.getItem("vehiculosIngresados");
        const updatedData = localData
          ? [...JSON.parse(localData), formData]
          : [formData];
        await AsyncStorage.setItem(
          "vehiculosIngresados",
          JSON.stringify(updatedData)
        );

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
      Alert.alert(
        "Error",
        "No se pudo enviar la información. Verifica tu conexión a internet."
      );

      const localData = await AsyncStorage.getItem("vehiculosPendientes");
      const updatedData = localData
        ? [...JSON.parse(localData), formData]
        : [formData];
      await AsyncStorage.setItem(
        "vehiculosPendientes",
        JSON.stringify(updatedData)
      );
      Alert.alert("Error", "No se pudo enviar la información al servidor.");
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <ScrollView>
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
                    />
                  </View>
                )}
              </VStack>

              {[
                "nombre",
                "hora",
                "cedula",
                "marca",
                "vehiculo",
                "destino",
                "fecha",
                "boleta",
                "pago",
                "monto",
                "observaciones",
              ].map((key) => (
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
