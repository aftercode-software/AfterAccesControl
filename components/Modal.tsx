import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";
import type { MovimientoServer } from "@/interfaces/interfaces";

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: (v: boolean) => void;
  selectedData?: MovimientoServer | null;
  handleMarcarSalida: (id: number) => Promise<void>;
}

export default function ModalComponent({
  isModalVisible,
  setIsModalVisible,
  selectedData,
  handleMarcarSalida,
}: Props) {
  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setIsModalVisible(false)}
      presentationStyle="overFullScreen"
    >
      <Pressable
        style={styles.backdrop}
        onPress={() => setIsModalVisible(false)}
      />

      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {selectedData
                ? `${selectedData.chapa} - ${selectedData.nombre}`
                : "Detalles"}
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <X color="#000" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
          >
            {selectedData ? (
              <View>
                <Text style={styles.row}>
                  <Text style={styles.bold}>Destino: </Text>
                  {selectedData.destino}
                </Text>
                <Text style={styles.row}>
                  <Text style={styles.bold}>Chapa y cédula: </Text>
                  {selectedData.chapa} - {selectedData.cedula}
                </Text>
                <Text style={styles.row}>
                  <Text style={styles.bold}>Ingreso: </Text>
                  {selectedData.fechaIngreso} - {selectedData.horaIngreso}
                </Text>
              </View>
            ) : (
              <Text style={{ color: "#ef4444", fontSize: 16 }}>
                No hay datos seleccionados
              </Text>
            )}
          </ScrollView>

          {selectedData && (
            <TouchableOpacity
              style={styles.cta}
              onPress={() =>
                handleMarcarSalida(selectedData?.localId ?? selectedData?.id)
              }
            >
              <Text style={styles.ctaText}>Marcar Salida</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centerWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "700" },
  row: { fontSize: 16, color: "#1f2937", marginBottom: 8 },
  bold: { fontWeight: "700" },
  cta: {
    backgroundColor: "#475569",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  ctaText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
