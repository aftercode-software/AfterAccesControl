import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react-native";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { colors } from "@/styles/tokens";

export default function PrimaryButton({
  children,
  onPress,
  disabled = false,
  loading = false,
  className = "",
}: {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled }}
      disabled={disabled || loading}
      onPress={onPress}
      className={`min-h-[52px] flex-row items-center justify-center gap-2 bg-amber px-8 active:opacity-80 disabled:bg-line disabled:opacity-70 ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={colors.ink} />
      ) : (
        <>
          <Text className="font-inter-bold text-[14px] text-ink">{children}</Text>
          <ArrowUpRight color={colors.ink} size={17} strokeWidth={2} />
        </>
      )}
    </Pressable>
  );
}
