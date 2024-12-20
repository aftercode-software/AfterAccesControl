import { MovimientoServer } from "@/interfaces/interfaces";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

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
  return (
    <Modal isVisible={isModalVisible}>
      <View className="bg-white p-6 rounded-lg items-center">
        {selectedData ? (
          <>
            <Text className="text-2xl font-bold mb-4">
              Datos del Movimiento
            </Text>
            <Text className="text-base mb-2">Chapa: {selectedData.chapa}</Text>
            <Text className="text-base mb-2">
              Nombre: {selectedData.nombre}
            </Text>
            <Text className="text-base mb-2">
              Destino: {selectedData.destino}
            </Text>
            <Text className="text-base mb-2">
              Fecha de Ingreso: {selectedData.fechaIngreso}
            </Text>
            <Text className="text-base mb-2">
              Hora de Ingreso: {selectedData.horaIngreso}
            </Text>

            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg mt-6"
              onPress={handleMarcarSalida}
            >
              <Text className="text-white font-bold text-lg">
                Marcar Salida
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text className="text-red-500 text-lg">
            No hay datos seleccionados
          </Text>
        )}

        <TouchableOpacity
          className="mt-4"
          onPress={() => setIsModalVisible(false)}
        >
          <Text className="text-red-500 text-lg">Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
