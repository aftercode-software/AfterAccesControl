"use client";

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
import type { MovimientoServer } from "@/interfaces/interfaces";
import ModalComponent from "@/components/Modal";
import { Bike, Car, CarFront, Tractor, Truck } from "lucide-react-native";
import { useData } from "@/hooks/useData";

export default function Salida() {
  const { getSentData, marcarSalida } = useData();
  const [data, setData] = useState<MovimientoServer[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<MovimientoServer | null>(
    null,
  );

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "transganado":
      case "tractor pesado":
      case "grua":
        return <Tractor color={"#000"} size={28} />;
      case "camion":
      case "tractor liviano":
      case "2 ejes":
        return <Truck color={"#000"} size={28} />;
      case "camioneta":
      case "suv":
      case "camioneta cabina simple":
      case "camioneta doble":
      case "automovil":
        return <Car color={"#000"} size={28} />;
      case "moto":
      case "bicicleta":
      case "otro":
        return <Bike color={"#000"} size={28} />;
      default:
        return <CarFront color={"#000"} size={28} />;
    }
  };

  const fetchData = async () => {
    try {
      const result = await getSentData();
      setData(result);
    } catch (error) {
      console.error("Error al obtener datos enviados:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
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
    <ScrollView
      nestedScrollEnabled
      scrollEnabled
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="w-full bg-white px-5 pt-6 pb-6">
          <View className="flex-row items-center mb-2 mt-6">
            <Text className="text-4xl font-bold text-black">Salida</Text>
          </View>
          <View className="mb-6 mt-6">
            <Text className="text-2xl font-medium text-black">
              Seleccione el vehículo
            </Text>
          </View>

          {data.length === 0 && (
            <Text className="text-base text-center mt-32 text-gray-500">
              No hay vehículos para marcar salida
            </Text>
          )}

          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white p-4 mb-3 rounded-xl border border-gray-200 flex-row items-center justify-between"
              onPress={() => handleCardPress(item)}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  {getVehicleIcon(item.vehiculo)}
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-bold text-black mb-1">
                    {item.chapa}
                  </Text>
                  <Text className="text-sm text-gray-600">{item.nombre}</Text>
                </View>
              </View>

              <Text className="text-sm text-gray-500 ml-2">
                {item.horaIngreso}
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
  );
}
