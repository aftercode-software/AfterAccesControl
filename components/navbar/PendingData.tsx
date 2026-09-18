import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CircleFadingArrowUp,
  X,
} from "lucide-react-native";
import { useData } from "@/hooks/useData";
import { colors } from "@/styles/tokens";

export default function PendingData() {
  const { pendingData, pendingExits, retryPendingData } = useData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const pendingCount = pendingData.length + pendingExits.length;

  if (pendingCount === 0) {
    return null;
  }

  const handleSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      await retryPendingData();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <Pressable
        accessibilityLabel={`${pendingCount} operaciones pendientes. Ver detalle`}
        accessibilityRole="button"
        onPress={() => setIsModalVisible(true)}
        className="flex-row items-center gap-[5px] bg-amber-soft px-3 py-[7px] active:opacity-70"
      >
        <Text className="font-inter-bold text-[12px] text-amber-deep">
          {pendingCount}
        </Text>
        <CircleFadingArrowUp color={colors.amberDeep} size={16} />
      </Pressable>

      <Modal
        backdropOpacity={0.42}
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        onBackButtonPress={() => setIsModalVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
        useNativeDriver
      >
        <View className="max-h-[82%] bg-canvas px-[22px] pb-8 pt-6">
          <View className="mb-5 flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-inter-semibold text-[25px] leading-7 tracking-[-0.7px] text-ink">
                Para sincronizar
              </Text>
              <Text className="mt-1 font-inter text-[13px] leading-[19px] text-slate">
                Estas operaciones están guardadas en este dispositivo.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Cerrar pendientes"
              accessibilityRole="button"
              onPress={() => setIsModalVisible(false)}
              className="h-[36px] w-[36px] items-center justify-center border border-line active:opacity-70"
            >
              <X color={colors.ink} size={19} />
            </Pressable>
          </View>

          <ScrollView
            className="mb-5"
            showsVerticalScrollIndicator={false}
          >
            {pendingData.map((movimiento) => {
              const hasLocalExit = Boolean(
                movimiento.fechaSalida && movimiento.horaSalida
              );

              return (
                <View
                  className="mb-3 border border-line bg-white p-4"
                  key={movimiento.localId}
                >
                  <View className="mb-3 flex-row items-start justify-between gap-3">
                    <View className="flex-1 flex-row items-center gap-2">
                      <View className="h-[30px] w-[30px] items-center justify-center bg-amber-soft">
                        {hasLocalExit ? (
                          <ArrowUpFromLine
                            color={colors.ink}
                            size={16}
                            strokeWidth={1.8}
                          />
                        ) : (
                          <ArrowDownToLine
                            color={colors.ink}
                            size={16}
                            strokeWidth={1.8}
                          />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="font-inter-semibold text-[15px] text-ink">
                          {movimiento.chapa || "Sin chapa"}
                        </Text>
                        <Text className="mt-0.5 font-inter-medium text-[11px] text-amber-deep">
                          {hasLocalExit ? "Entrada + salida local" : "Entrada"}
                        </Text>
                      </View>
                    </View>
                    <Text className="font-inter-medium text-[11px] text-slate">
                      {movimiento.cedula || "Sin cédula"}
                    </Text>
                  </View>

                  <PendingDetail label="Persona" value={movimiento.nombre} />
                  <PendingDetail
                    label="Vehículo"
                    value={`${movimiento.marca || "—"} · ${movimiento.vehiculo || "—"}`}
                  />
                  <PendingDetail label="Destino" value={movimiento.destino} />
                  <PendingDetail
                    label="Ingreso"
                    value={`${movimiento.fechaIngreso || "—"} · ${movimiento.horaIngreso || "—"}`}
                  />
                  {hasLocalExit ? (
                    <PendingDetail
                      label="Salida local"
                      value={`${movimiento.fechaSalida} · ${movimiento.horaSalida}`}
                    />
                  ) : null}
                </View>
              );
            })}

            {pendingExits.map((salida) => (
              <View
                className="mb-3 border border-line bg-white p-4"
                key={`salida-${salida.id}`}
              >
                <View className="mb-3 flex-row items-center gap-2">
                  <View className="h-[30px] w-[30px] items-center justify-center bg-amber-soft">
                    <ArrowUpFromLine
                      color={colors.ink}
                      size={16}
                      strokeWidth={1.8}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-[15px] text-ink">
                      {salida.movimiento?.chapa || `Movimiento #${salida.id}`}
                    </Text>
                    <Text className="mt-0.5 font-inter-medium text-[11px] text-amber-deep">
                      Salida
                    </Text>
                  </View>
                </View>

                {salida.movimiento?.nombre ? (
                  <PendingDetail
                    label="Persona"
                    value={salida.movimiento.nombre}
                  />
                ) : null}
                <PendingDetail
                  label="Salida registrada"
                  value={`${salida.fechaSalida} · ${salida.horaSalida}`}
                />
              </View>
            ))}
          </ScrollView>

          <Pressable
            accessibilityLabel="Intentar sincronizar ahora"
            accessibilityRole="button"
            disabled={isSyncing}
            onPress={() => {
              void handleSync();
            }}
            className="min-h-[52px] flex-row items-center justify-center gap-2 bg-amber active:opacity-80"
          >
            {isSyncing ? (
              <ActivityIndicator color={colors.ink} />
            ) : (
              <CircleFadingArrowUp color={colors.ink} size={18} />
            )}
            <Text className="font-inter-bold text-[14px] text-ink">
              {isSyncing ? "Comprobando conexión" : "Sincronizar ahora"}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

function PendingDetail({ label, value }: { label: string; value?: string }) {
  return (
    <View className="flex-row justify-between gap-4 border-t border-line py-2">
      <Text className="font-inter-medium text-[11px] text-slate">{label}</Text>
      <Text className="flex-1 text-right font-inter-medium text-[11px] text-ink">
        {value || "—"}
      </Text>
    </View>
  );
}
