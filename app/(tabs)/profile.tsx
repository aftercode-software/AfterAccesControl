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
  ArrowDownToLine,
  ArrowUpFromLine,
  Banknote,
  LogOut,
  ReceiptText,
} from "lucide-react-native";
import { Estadisticas } from "@/interfaces/interfaces";
import { useData } from "@/hooks/useData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "react-native-toast-notifications";
import SelectField from "@/components/ui/SelectField";
import { colors } from "@/styles/tokens";

type StatsPeriod = "mensuales" | "hoy";

export default function Profile() {
  const { user, logout } = useAuth();
  const { getEstadisticas } = useData();
  const [selectedValue, setSelectedValue] = useState<StatsPeriod>("hoy");
  const [estadisticas, setEstadisticas] = useState<Estadisticas>();
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getEstadisticas(selectedValue);
      setEstadisticas(result);
    } catch (error) {
      console.error("Error al obtener datos enviados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getEstadisticas, selectedValue]);

  useFocusEffect(
    useCallback(() => {
      void fetchData();
    }, [fetchData])
  );

  const handleLogout = async () => {
    try {
      await logout();
      toast.show("Sesión cerrada correctamente", {
        type: "success",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const metrics = [
    {
      label: "Ingresos",
      value: estadisticas?.cantidadIngresos,
      Icon: ArrowDownToLine,
    },
    {
      label: "Salidas",
      value: estadisticas?.cantidadSalidas,
      Icon: ArrowUpFromLine,
    },
    {
      label: "Efectivo cobrado",
      value: estadisticas?.cantidadEfectivo,
      Icon: Banknote,
      money: true,
    },
    {
      label: "Boletas",
      value: estadisticas?.cantidadBoletas,
      Icon: ReceiptText,
    },
  ];

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
              Perfil
            </Text>
            <Text className="mt-2 font-inter text-[14px] leading-[21px] text-slate">
              Resumen de actividad para {user?.username || "este acceso"}.
            </Text>
          </View>
          <View className="h-11 w-11 items-center justify-center bg-ink">
            <Text className="font-inter-semibold text-[17px] text-white">
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
        </View>

        <View className="h-px bg-line" />

        <View className="mt-6 flex-row items-end justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-inter-semibold text-[20px] tracking-[-0.4px] text-ink">
              Actividad del día
            </Text>
            <Text className="mt-1 font-inter text-[12px] leading-[18px] text-slate">
              Una lectura breve de los movimientos registrados.
            </Text>
          </View>
          <SelectField
            containerClassName="w-32"
            label="Período"
            onValueChange={(value) => setSelectedValue(value as StatsPeriod)}
            options={["hoy", "mensuales"]}
            optionLabels={{ hoy: "Hoy", mensuales: "Mensual" }}
            placeholder="Seleccionar"
            value={selectedValue}
          />
        </View>

        {isLoading ? (
          <View className="min-h-[230px] items-center justify-center gap-3">
            <ActivityIndicator color={colors.amberDeep} />
            <Text className="font-inter text-[13px] text-slate">Cargando resumen</Text>
          </View>
        ) : (
          <View className="mt-6 flex-row flex-wrap justify-between gap-3">
            {metrics.map(({ Icon, label, money, value }) => (
              <View
                className="min-h-[132px] w-[48.5%] border border-line bg-white p-4"
                key={label}
              >
                <View className="mb-4 h-[34px] w-[34px] items-center justify-center bg-amber-soft">
                  <Icon color={colors.ink} size={18} strokeWidth={1.8} />
                </View>
                <Text className="font-inter text-[11px] leading-4 text-slate">{label}</Text>
                <Text className="mt-1 font-inter-semibold text-[24px] leading-[27px] tracking-[-0.6px] text-ink">
                  {value === undefined
                    ? "—"
                    : money
                      ? `$ ${value}`
                      : value.toString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleLogout();
          }}
          className="mt-8 min-h-[50px] flex-row items-center justify-center gap-2 border border-line active:opacity-70"
        >
          <LogOut color={colors.ink} size={17} />
          <Text className="font-inter-semibold text-[13px] text-ink">Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
