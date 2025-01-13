import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { UserPen } from "lucide-react-native";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "react-native-toast-notifications";
import OverviewBox from "@/components/OverviewBox";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useData } from "@/hooks/useData";
import { Estadisticas } from "@/interfaces/interfaces";
import { Picker } from "@react-native-picker/picker";

export default function Profile() {
  const { user, logout } = useAuth();
  const { getEstadisticas } = useData();
  const [selectedValue, setSelectedValue] = useState<"mensuales" | "hoy">(
    "hoy"
  );
  const [estadisticas, setEstadisticas] = useState<Estadisticas>();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      logout();
      toast.show("Sesión cerrada correctamente", {
        type: "success",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const fetchData = async () => {
    try {
      const result = await getEstadisticas(selectedValue);
      setEstadisticas(result);
    } catch (error) {
      console.error("Error al obtener datos enviados:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Fetching data...");
      fetchData();
    }, [selectedValue])
  );

  return (
    <GluestackUIProvider mode="light">
      <ScrollView
        nestedScrollEnabled
        scrollEnabled
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View className="w-full bg-white p-6 shadow-lg pt-20 items-center flex-1">
            <Text className="text-4xl mb-10 w-full font-bold text-left text-black font-inter">
              Perfil <UserPen color={"#000"} />
            </Text>

            <View className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Text className="text-4xl font-bold text-black font-inter">
                {user?.username?.charAt(0).toUpperCase()}
              </Text>
            </View>

            <Text className="text-xl font-semibold text-black mb-20 font-inter">
              {user?.username}
            </Text>

            <View
              style={{
                borderRadius: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",

                paddingVertical: 8,
                paddingHorizontal: 12,
                marginBottom: 16,
                marginHorizontal: 0,
              }}
              className="border-slate-300 border-[1px]"
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#000",
                  fontFamily: "Inter",
                }}
              >
                Vistazo general
              </Text>

              <Picker
                selectedValue={selectedValue}
                style={{
                  height: 55,
                  width: 150,
                }}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
              >
                <Picker.Item label="Hoy" value="hoy" />
                <Picker.Item label="Mensual" value="mensuales" />
              </Picker>
            </View>

            <View style={styles.grid}>
              <OverviewBox
                title="Ingresos"
                value={estadisticas?.cantidadIngresos}
              />
              <OverviewBox
                title="Salidas"
                value={estadisticas?.cantidadSalidas}
              />
              <OverviewBox
                title="Efectivo cobrado"
                value={estadisticas?.cantidadEfectivo}
                moneyStyle
              />
              <OverviewBox
                title="Cantidad boletas"
                value={estadisticas?.cantidadBoletas}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-slate-600 py-3 px-8 rounded-lg mt-auto mb-10"
              style={{ position: "absolute", bottom: 10, alignSelf: "center" }}
            >
              <Text className="text-lg font-bold text-white font-inter">
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  box: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#ccc",
    marginVertical: 4,
    borderRadius: 8,
  },
});
