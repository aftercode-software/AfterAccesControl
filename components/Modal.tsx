import { ArrowUpRight, X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Modal from "react-native-modal";
import { MovimientoServer } from "@/interfaces/interfaces";
import { colors } from "@/styles/tokens";

interface ModalComponentProps {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  selectedData?: MovimientoServer | null;
  handleMarcarSalida: () => void;
}

export default function ModalComponent({
  isModalVisible,
  setIsModalVisible,
  selectedData,
  handleMarcarSalida,
}: ModalComponentProps) {
  const closeModal = () => setIsModalVisible(false);

  return (
    <Modal
      backdropOpacity={0.42}
      isVisible={isModalVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      style={{ justifyContent: "flex-end", margin: 0 }}
      useNativeDriver
    >
      <View className="bg-canvas px-[22px] pb-8 pt-6">
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-inter-semibold text-[26px] tracking-[-0.8px] text-ink">
              {selectedData?.chapa || "Detalles del acceso"}
            </Text>
            {selectedData ? (
              <Text className="mt-1 font-inter text-[14px] text-slate">
                {selectedData.nombre}
              </Text>
            ) : null}
            {selectedData?.isPending ? (
              <Text className="mt-1 font-inter-medium text-[11px] text-amber-deep">
                Pendiente de sincronización
              </Text>
            ) : null}
          </View>
          <Pressable
            accessibilityLabel="Cerrar detalles"
            accessibilityRole="button"
            onPress={closeModal}
            className="h-[34px] w-[34px] items-center justify-center border border-line active:opacity-70"
          >
            <X color={colors.ink} size={19} />
          </Pressable>
        </View>

        {selectedData ? (
          <View className="mb-6">
            <DetailRow label="Destino" value={selectedData.destino} />
            <DetailRow
              label="Cédula"
              value={selectedData.cedula}
            />
            <DetailRow
              label="Ingreso"
              value={`${selectedData.fechaIngreso} · ${selectedData.horaIngreso}`}
            />
          </View>
        ) : (
          <Text className="mb-6 font-inter text-[14px] text-slate">
            No hay datos seleccionados.
          </Text>
        )}

        {selectedData ? (
          <Pressable
            accessibilityRole="button"
            onPress={handleMarcarSalida}
            className="min-h-[52px] flex-row items-center justify-center gap-2 bg-amber active:opacity-80"
          >
            <Text className="font-inter-bold text-[14px] text-ink">Marcar salida</Text>
            <ArrowUpRight color={colors.ink} size={17} />
          </Pressable>
        ) : null}
      </View>
    </Modal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-1 border-b border-line py-3">
      <Text className="font-inter-medium text-[11px] text-slate">{label}</Text>
      <Text className="font-inter-medium text-[15px] text-ink">{value || "—"}</Text>
    </View>
  );
}
