import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { CloudOff, RefreshCw } from "lucide-react-native";
import { useToast } from "react-native-toast-notifications";
import { Movimiento } from "@/interfaces/interfaces";
import { getCurrentDateTimeInParaguay } from "@/utilities/dateTime";
import { paymentTypes, popularBrands, vehicleTypes } from "@/constants/ingreso";
import { useData } from "@/hooks/useData";
import ConnectionPill from "@/components/ui/ConnectionPill";
import Field from "@/components/ui/Field";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SelectField from "@/components/ui/SelectField";
import { colors } from "@/styles/tokens";

const createInitialFormData = () => ({
  nombre: "",
  horaIngreso: "",
  cedula: "",
  marca: "",
  vehiculo: "",
  chapa: "",
  destino: "",
  fechaIngreso: "",
  monto: 0 as number | "",
  pago: "",
  boleta: "",
  observaciones: "",
});

export default function Ingreso() {
  const [formData, setFormData] = useState(createInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();
  const {
    connectionStatus,
    refreshConnection,
    saveFormData,
    pendingData,
    pendingExits,
    retryPendingData,
  } = useData();
  const isConnected = connectionStatus === "connected";
  const { currentDate, currentTime } = getCurrentDateTimeInParaguay();

  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshConnection();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshConnection]);

  const shouldShowMonto =
    formData.pago !== "boleta" &&
    formData.pago !== "falta pagar" &&
    formData.pago !== "";
  const shouldShowBoleta = formData.pago === "boleta";

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const requiredFields: (keyof typeof formData)[] = [
      "nombre",
      "cedula",
      "marca",
      "vehiculo",
      "chapa",
      "destino",
      "pago",
    ];

    for (const field of requiredFields) {
      const value = formData[field];
      if (typeof value !== "string" || value.trim() === "") {
        toast.show(`El campo ${field} es obligatorio`, {
          type: "danger",
          placement: "top",
        });
        return;
      }
    }

    if (formData.pago === "efectivo" &&
      (typeof formData.monto !== "number" || formData.monto <= 0)) {
      toast.show("El monto debe ser mayor a 0", {
        type: "danger",
        placement: "top",
      });
      return;
    }

    if (formData.pago === "boleta" && !formData.boleta.trim()) {
      toast.show("El número de boleta es obligatorio", {
        type: "danger",
        placement: "top",
      });
      return;
    }

    const payload = {
      ...formData,
      fechaIngreso: currentDate,
      horaIngreso: currentTime,
      monto: formData.pago === "falta pagar" ? "" : formData.monto,
    };

    setIsSubmitting(true);
    try {
      await saveFormData(payload as Movimiento);
      setFormData(createInitialFormData());
    } catch (error) {
      console.error("Error al enviar datos:", error);
      Alert.alert("Error", "No se pudo guardar la información.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasOfflineState =
    connectionStatus === "offline" ||
    connectionStatus === "server-unavailable" ||
    pendingData.length > 0 ||
    pendingExits.length > 0;
  const pendingCount = pendingData.length + pendingExits.length;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-canvas"
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-8 pt-6"
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              void handleRefresh();
            }}
            refreshing={isRefreshing}
            tintColor={colors.amberDeep}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-inter-semibold text-[30px] leading-[33px] tracking-[-0.9px] text-ink">
              Registrar ingreso
            </Text>
            <Text className="mt-2 font-inter text-[14px] leading-[21px] text-slate">
              Completá la información del acceso de forma clara y rápida.
            </Text>
          </View>
        </View>

        {hasOfflineState ? (
          <View className="mb-6 min-h-[48px] flex-row items-center gap-2 bg-amber-soft px-3 py-2">
            <CloudOff color={colors.amberDeep} size={17} strokeWidth={1.8} />
            <Text className="flex-1 font-inter-medium text-[11px] leading-4 text-ink">
              {connectionStatus === "offline"
                ? "Sin conexión. El registro se guarda localmente."
                : connectionStatus === "server-unavailable"
                  ? "Servidor no disponible. El registro se guarda localmente."
                  : `${pendingCount} operación${pendingCount === 1 ? "" : "es"} esperando sincronización.`}
            </Text>
            {isConnected && pendingCount > 0 ? (
              <Pressable
                accessibilityLabel="Sincronizar registros pendientes"
                accessibilityRole="button"
                onPress={() => {
                  void retryPendingData();
                }}
                className="h-[30px] w-[30px] items-center justify-center active:opacity-70"
              >
                <RefreshCw color={colors.amberDeep} size={15} />
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <View className="gap-6">
          <Text className="font-inter-semibold text-[17px] tracking-[-0.25px] text-ink">
            Datos del acceso
          </Text>
          <View className="flex-row gap-3">
            <Field
              autoCapitalize="characters"
              containerClassName="flex-1"
              label="Chapa"
              onChangeText={(value) => handleInputChange("chapa", value)}
              placeholder="AB 123 CD"
              value={formData.chapa}
            />
            <Field
              containerClassName="flex-1"
              keyboardType="numeric"
              label="Cédula"
              onChangeText={(value) => handleInputChange("cedula", value)}
              placeholder="Número de documento"
              value={formData.cedula}
            />
          </View>

          <Field
            autoCapitalize="words"
            label="Nombre"
            onChangeText={(value) => handleInputChange("nombre", value)}
            placeholder="Nombre y apellido"
            value={formData.nombre}
          />

          <Field
            autoCapitalize="sentences"
            label="Destino"
            onChangeText={(value) => handleInputChange("destino", value)}
            placeholder="¿A dónde se dirige?"
            value={formData.destino}
          />

          <View className="flex-row gap-3">
            <SelectField
              containerClassName="flex-1"
              label="Vehículo"
              onValueChange={(value) => handleInputChange("vehiculo", value)}
              options={vehicleTypes}
              value={formData.vehiculo}
            />
            <SelectField
              containerClassName="flex-1"
              label="Marca"
              onValueChange={(value) => handleInputChange("marca", value)}
              options={popularBrands}
              value={formData.marca}
            />
          </View>

          <Text className="font-inter-semibold text-[17px] tracking-[-0.25px] text-ink">
            Forma de pago
          </Text>
          <SelectField
            label="Pago"
            onValueChange={(value) => {
              setFormData((previous) => ({
                ...previous,
                pago: value,
                monto: value === "efectivo" ? previous.monto : 0,
                boleta: value === "boleta" ? previous.boleta : "",
              }));
            }}
            options={paymentTypes}
            placeholder="Seleccionar forma de pago"
            value={formData.pago}
          />

          {shouldShowMonto ? (
            <Field
              keyboardType="numeric"
              label="Monto"
              onChangeText={(value) =>
                setFormData((previous) => ({
                  ...previous,
                  monto: value === "" ? 0 : Number(value),
                }))
              }
              placeholder="Ingresá el monto"
              value={formData.monto === "" ? "" : String(formData.monto)}
            />
          ) : null}

          {shouldShowBoleta ? (
            <Field
              label="Número de boleta"
              onChangeText={(value) => handleInputChange("boleta", value)}
              placeholder="Ingresá el número"
              value={formData.boleta}
            />
          ) : null}

          <Field
            label="Observaciones"
            multiline
            onChangeText={(value) =>
              handleInputChange("observaciones", value)
            }
            placeholder="Información adicional (opcional)"
            value={formData.observaciones}
          />

          <PrimaryButton
            loading={isSubmitting}
            onPress={() => {
              void handleSubmit();
            }}
            className="mt-2"
          >
            Registrar ingreso
          </PrimaryButton>
        </View>

        <Text className="mt-8 font-inter-semibold text-[9px] tracking-[1px] text-slate-muted">
          ETRACK ACCESS / REGISTRO CLARO
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
