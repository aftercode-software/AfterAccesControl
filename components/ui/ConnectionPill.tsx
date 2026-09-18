import { Wifi, WifiOff } from "lucide-react-native";
import { Text, View } from "react-native";
import { ConnectionStatus } from "@/interfaces/interfaces";
import { colors } from "@/styles/tokens";

export default function ConnectionPill({
  status,
  compact = false,
}: {
  status: ConnectionStatus;
  compact?: boolean;
}) {
  const connected = status === "connected";
  const checking = status === "checking";
  const Icon = connected || checking ? Wifi : WifiOff;
  const label =
    status === "server-unavailable"
      ? "Servidor no disponible"
      : status === "offline"
        ? "Sin conexión"
        : status === "checking"
          ? "Verificando conexión"
          : "Conectado";

  return (
    <View
      accessibilityLabel={label}
      className={`flex-row items-center gap-[5px] ${
        connected ? "bg-success-soft" : "bg-amber-soft"
      } ${compact ? "px-[7px] py-[7px]" : "px-[9px] py-[6px]"}`}
    >
      <Icon
        color={connected ? colors.success : colors.amberDeep}
        size={12}
        strokeWidth={1.8}
      />
      {!compact ? (
        <Text className="font-inter-medium text-[10px] text-ink">
          {label}
        </Text>
      ) : null}
    </View>
  );
}
