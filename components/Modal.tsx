import { MovimientoServer } from "@/interfaces/interfaces";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { X } from "lucide-react-native";

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
    <Modal isVisible={isModalVisible} backdropOpacity={0.5}>
      <View className="bg-white p-6 rounded-lg">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold font-inter">
            {selectedData
              ? `${selectedData.chapa} - ${selectedData.nombre}`
              : "Detalles"}
          </Text>
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <X color="#000" size={24} />
          </TouchableOpacity>
        </View>

        {selectedData ? (
          <View className="mb-6">
            <Text className="text-lg font-inter text-gray-800 mb-2">
              <Text className="font-bold font-inter">Destino:</Text>{" "}
              {selectedData.destino}
            </Text>
            <Text className="text-lg font-inter text-gray-800 mb-2">
              <Text className="font-bold font-inter">Chapa y cedula:</Text>{" "}
              {selectedData.chapa} - {selectedData.cedula}
            </Text>
            <Text className="text-lg font-inter text-gray-800 mb-2">
              <Text className="font-bold font-inter">Ingreso:</Text>{" "}
              {selectedData.fechaIngreso} - {selectedData.horaIngreso}
            </Text>
          </View>
        ) : (
          <Text className="text-red-500 text-lg">
            No hay datos seleccionados
          </Text>
        )}

        {selectedData && (
          <TouchableOpacity
            className="bg-slate-600 px-6 py-3 rounded-lg mb-2"
            onPress={handleMarcarSalida}
          >
            <Text className="text-white font-bold text-lg text-center">
              Marcar Salida
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}
