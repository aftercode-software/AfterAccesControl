"use client";

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  RefreshControl,
  Alert,
} from "react-native";
import {
  Bike,
  Car,
  CarFront,
  Tractor,
  Truck,
  ArrowUpCircle,
} from "lucide-react-native";
import { useData } from "@/hooks/useData";

type OpenItem = {
  localId: string;
  id?: number;
  chapa: string;
  nombre: string;
  vehiculo: string;
  horaIngreso: string;
};

export default function Salida() {
  const { pendingData, marcarSalida, retryPendingData } = useData();
  const [refreshing, setRefreshing] = React.useState(false);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "transganado":
      case "tractor pesado":
      case "grua":
        return <Tractor color="#000" size={28} />;
      case "camion":
      case "tractor liviano":
      case "2 ejes":
        return <Truck color="#000" size={28} />;
      case "camioneta":
      case "suv":
      case "camioneta cabina simple":
      case "camioneta doble":
      case "automovil":
        return <Car color="#000" size={28} />;
      case "moto":
      case "bicicleta":
      case "otro":
        return <Bike color="#000" size={28} />;
      default:
        return <CarFront color="#000" size={28} />;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await retryPendingData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleConfirmSalida = (item: OpenItem) => {
    Alert.alert(
      "Confirmar salida",
      `¿Seguro que quieres marcar salida para ${item.chapa}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, marcar salida",
          style: "destructive",
          onPress: async () => {
            await marcarSalida(item.id ?? item.localId);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const data = (pendingData as unknown as OpenItem[]) || [];

  return (
    <ScrollView
      nestedScrollEnabled
      scrollEnabled
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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

          {data.map((item) => {
            const tieneServerId = typeof item.id === "number";
            return (
              <View
                key={item.localId}
                className="bg-white p-4 mb-3 rounded-xl border border-gray-200 flex-row items-center justify-between"
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
                    {!tieneServerId && (
                      <Text className="text-xs text-yellow-600 mt-1">
                        Pendiente (sin conexión)
                      </Text>
                    )}
                  </View>
                </View>

                {/* --- Botón de salida --- */}
                <TouchableOpacity
                  onPress={() => handleConfirmSalida(item)}
                  className="ml-3"
                  activeOpacity={0.7}
                >
                  <ArrowUpCircle color="#2563EB" size={28} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
