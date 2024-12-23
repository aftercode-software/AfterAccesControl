import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useData } from "@/context/DataContext";
import { MovimientoServer } from "@/interfaces/interfaces";
import ModalComponent from "@/components/Modal";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ArrowUp, Car, Tractor, Truck } from "lucide-react-native";

export default function Salida() {
  const { getSentData, marcarSalida } = useData();
  const [data, setData] = useState<MovimientoServer[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<MovimientoServer | null>(
    null
  );

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "transganado":
        return <Tractor color={"#000"} />;
      case "camion":
        return <Truck color={"#000"} />;
      case "camioneta":
        return <Car color={"#000"} />;
      default:
        return null;
    }
  };

  const fetchData = async () => {
    try {
      const result = await getSentData();
      console.log("Datos enviados:", result);
      setData(result);
    } catch (error) {
      console.error("Error al obtener datos enviados:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleCardPress = (item: MovimientoServer) => {
    setSelectedData(item);
    setIsModalVisible(true);
  };

  const handleMarcarSalida = async () => {
    if (!selectedData) return;

    try {
      await marcarSalida(selectedData.id);

      const updatedData = data.filter((item) => item.id !== selectedData.id);
      setData(updatedData);

      setIsModalVisible(false);
    } catch (error) {
      console.error("Error al marcar salida:", error);
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="w-full bg-white p-6  pt-20">
            <Text className="text-4xl mb-6 font-bold text-left text-black font-inter">
              Salida <ArrowUp color={"#000"} />
            </Text>
            {data.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-white p-4 my-2 rounded-lg shadow-md flex-row items-center"
                onPress={() => handleCardPress(item)}
              >
                <View className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  {getVehicleIcon(item.vehiculo)}
                </View>
                <Text className="text-lg font-semibold font-inter">
                  {item.chapa} - {item.nombre}
                </Text>
              </TouchableOpacity>
            ))}

            <ModalComponent
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
              selectedData={selectedData}
              handleMarcarSalida={handleMarcarSalida}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </GluestackUIProvider>
  );
}
