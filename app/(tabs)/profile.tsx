"use client";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  LogOut,
} from "lucide-react-native";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "react-native-toast-notifications";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useData } from "@/hooks/useData";
import type { Estadisticas } from "@/interfaces/interfaces";
import { Picker } from "@react-native-picker/picker";

type Range = "mensuales" | "hoy";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  moneyStyle = false,
}: {
  title: string;
  value: number | undefined;
  icon: any;
  color: string;
  moneyStyle?: boolean;
}) => {
  const displayValue = moneyStyle
    ? `$${value?.toLocaleString?.() || 0}`
    : value?.toString() || "0";

  return (
    <View
      className="bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-gray-100"
      style={{ borderLeftColor: color, borderLeftWidth: 4 }}
    >
      <View className="mr-4">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={24} color={color} />
        </View>
      </View>

      <View className="flex-1">
        <Text className="text-xs text-black mb-1 font-inter">{title}</Text>
        <Text className="text-2xl font-bold text-black font-inter">
          {displayValue}
        </Text>
      </View>
    </View>
  );
};

export default function Profile() {
  const { user, logout } = useAuth();
  const { getEstadisticas } = useData();
  const [selectedValue, setSelectedValue] = useState<Range>("hoy");
  const [estadisticas, setEstadisticas] = useState<Estadisticas>();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      logout();
      toast.show("Sesión cerrada correctamente", { type: "success" });
    } catch (error) {
      console.warn("Error al cerrar sesión:", (error as Error).message);
    }
  };

  const fetchData = async () => {
    try {
      const result = await getEstadisticas(selectedValue);
      setEstadisticas(result);
    } catch (error) {
      console.warn("Error al obtener estadísticas:", (error as Error).message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [selectedValue]),
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
          className="flex-1"
        >
          <View className="w-full bg-white px-5 pt-6 pb-6">
            <View className="flex-row items-center mb-2 mt-6">
              <Text className="text-4xl font-bold text-black">Perfil</Text>
            </View>

            <View className="items-center mb-10">
              <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
                <Text className="text-4xl font-bold text-black font-inter">
                  {user?.username?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-lg font-semibold text-black font-inter">
                {user?.username}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mb-5 pb-3 border-b-2 border-gray-200">
              <Text className="text-lg font-bold text-black font-inter">
                Vistazo general
              </Text>

              <View className="border border-gray-300 rounded-lg overflow-hidden">
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(v) => setSelectedValue(v)}
                  style={{ height: 50, width: 140 }}
                >
                  <Picker.Item label="Hoy" value="hoy" />
                  <Picker.Item label="Mensual" value="mensuales" />
                </Picker>
              </View>
            </View>

            <View className="gap-4 mb-10">
              <StatCard
                title="Cant. Ingresos"
                value={estadisticas?.cantidadIngresos}
                icon={TrendingUp}
                color="#10b981"
              />
              <StatCard
                title="Cant. Salidas"
                value={estadisticas?.cantidadSalidas}
                icon={TrendingDown}
                color="#ef4444"
              />
              <StatCard
                title="Efectivo cobrado"
                value={estadisticas?.cantidadEfectivo}
                icon={DollarSign}
                color="#3b82f6"
                moneyStyle
              />
              <StatCard
                title="Cantidad de boletas"
                value={estadisticas?.cantidadBoletas}
                icon={FileText}
                color="#f59e0b"
              />
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-black py-4 px-8 rounded-xl flex-row items-center justify-center mt-auto"
            >
              <LogOut size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white text-base font-bold font-inter">
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </GluestackUIProvider>
  );
}
