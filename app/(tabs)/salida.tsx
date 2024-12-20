import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useData } from "@/context/DataContext";
import { MovimientoServer } from "@/interfaces/interfaces";
import ModalComponent from "@/components/Modal";

export default function Salida() {
  const { getSentData } = useData();
  const [data, setData] = useState<MovimientoServer[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<MovimientoServer | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSentData();
        setData(result);
      } catch (error) {
        console.error("Error al obtener datos enviados:", error);
      }
    };

    fetchData();
  }, [getSentData]);

  const handleCardPress = (item: MovimientoServer) => {
    setSelectedData(item);
    setIsModalVisible(true);
  };

  const handleMarcarSalida = () => {
    console.log("Salida registrada para:", selectedData);
    setIsModalVisible(false);
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <Text className="text-4xl  text-center mb-5 font-inter font-bold">
        Personas Registradas
      </Text>

      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="bg-white p-4 my-2 rounded-lg shadow-md"
          onPress={() => handleCardPress(item)}
        >
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
  );
}
