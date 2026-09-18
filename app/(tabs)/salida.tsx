import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import {
  Bike,
  Car,
  CarFront,
  ChevronRight,
  CircleCheck,
  LogOut,
  Tractor,
  Truck,
} from "lucide-react-native";
import { MovimientoServer } from "@/interfaces/interfaces";
import ModalComponent from "@/components/Modal";
import { useData } from "@/hooks/useData";
import { colors } from "@/styles/tokens";

export default function Salida() {
  const { getSentData, marcarSalida } = useData();
  const [data, setData] = useState<MovimientoServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<MovimientoServer | null>(
    null
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getSentData();
      setData(result);
    } catch (error) {
      console.error("Error al obtener datos enviados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getSentData]);

  useFocusEffect(
    useCallback(() => {
      void fetchData();
    }, [fetchData])
  );

  const handleCardPress = (item: MovimientoServer) => {
    setSelectedData(item);
    setIsModalVisible(true);
  };

  const handleMarcarSalida = async () => {
    if (!selectedData) return;

    try {
      await marcarSalida(selectedData.id, selectedData.localId);
      setData((currentData) =>
        currentData.filter((item) => item.id !== selectedData.id)
      );
      setIsModalVisible(false);
      setSelectedData(null);
    } catch (error) {
      console.error("Error al marcar salida:", error);
    }
  };

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-8 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-inter-semibold text-[30px] leading-[33px] tracking-[-0.9px] text-ink">
              Marcar salida
            </Text>
            <Text className="mt-2 font-inter text-[14px] leading-[21px] text-slate">
              Seleccioná un acceso activo para completar su recorrido.
            </Text>
          </View>
          <View className="min-w-[58px] items-end bg-amber-soft px-3 py-2">
            <Text className="font-inter-semibold text-[20px] leading-[22px] tracking-[-0.7px] text-ink">
              {data.length.toString().padStart(2, "0")}
            </Text>
            <Text className="mt-0.5 font-inter-medium text-[9px] text-amber-deep">
              Activos
            </Text>
          </View>
        </View>

        <View className="h-px bg-line" />

        {isLoading ? (
          <View className="min-h-[280px] items-center justify-center px-6 py-8">
            <ActivityIndicator color={colors.amberDeep} />
            <Text className="mb-2 mt-3 font-inter-semibold text-[17px] text-ink">
              Cargando accesos
            </Text>
          </View>
        ) : data.length === 0 ? (
          <View className="min-h-[280px] items-center justify-center px-6 py-8">
            <View className="mb-4 h-[52px] w-[52px] items-center justify-center bg-success-soft">
              <CircleCheck color={colors.success} size={25} strokeWidth={1.7} />
            </View>
            <Text className="mb-2 font-inter-semibold text-[17px] text-ink">
              No hay salidas pendientes
            </Text>
            <Text className="max-w-[290px] text-center font-inter text-[13px] leading-5 text-slate">
              Los accesos registrados aparecerán acá hasta que se marque su salida.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {data.map((item) => (
              <Pressable
                accessibilityLabel={`Abrir acceso ${item.chapa} de ${item.nombre}`}
                accessibilityRole="button"
                android_ripple={{ color: colors.amberSoft }}
                key={item.id}
                onPress={() => handleCardPress(item)}
                className="min-h-[92px] flex-row items-center gap-3 border border-line bg-white px-4 py-3 active:opacity-80"
              >
                <View className="h-11 w-11 items-center justify-center bg-amber-soft">
                  {getVehicleIcon(item.vehiculo)}
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="font-inter-semibold text-[16px] text-ink">{item.chapa}</Text>
                  <Text className="mt-0.5 font-inter text-[13px] text-slate">{item.nombre}</Text>
                  <Text className="mt-1 font-inter text-[11px] text-slate">
                    {item.isPending
                      ? "Pendiente de sincronización"
                      : `${item.destino || "Destino no informado"} · Ingreso ${item.horaIngreso || "—"}`}
                  </Text>
                </View>
                <ChevronRight color={colors.slate} size={19} />
              </Pressable>
            ))}
          </View>
        )}

        <View className="mt-6 flex-row items-start gap-2 border-t border-line pt-3">
          <LogOut color={colors.slate} size={15} />
          <Text className="flex-1 font-inter text-[11px] leading-4 text-slate">
            Tocá un registro para revisar sus datos antes de marcar la salida.
          </Text>
        </View>
      </ScrollView>

      <ModalComponent
        handleMarcarSalida={() => {
          void handleMarcarSalida();
        }}
        isModalVisible={isModalVisible}
        selectedData={selectedData}
        setIsModalVisible={setIsModalVisible}
      />
    </View>
  );
}

function getVehicleIcon(type: string) {
  const iconProps = { color: colors.ink, size: 22, strokeWidth: 1.7 };

  switch (type) {
    case "transganado":
    case "tractor pesado":
    case "grua":
      return <Tractor {...iconProps} />;
    case "camion":
    case "tractor liviano":
    case "2 ejes":
      return <Truck {...iconProps} />;
    case "camioneta":
    case "suv":
    case "camioneta cabina simple":
    case "camioneta doble":
    case "automovil":
    case "auto":
      return <Car {...iconProps} />;
    case "moto":
    case "bicicleta":
    case "otro":
      return <Bike {...iconProps} />;
    default:
      return <CarFront {...iconProps} />;
  }
}
