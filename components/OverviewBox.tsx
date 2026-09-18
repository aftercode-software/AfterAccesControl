import { Text, View } from "react-native";

export default function OverviewBox({
  title,
  value,
  moneyStyle,
}: {
  title: string;
  value: number | undefined;
  moneyStyle?: boolean;
}) {
  return (
    <View className="min-h-[120px] w-[48%] border border-line bg-white p-4">
      <Text className="font-inter text-[11px] text-slate">{title}</Text>
      <Text className="mt-3 font-inter-semibold text-[24px] tracking-[-0.6px] text-ink">
        {value === undefined ? "—" : moneyStyle ? `$ ${value}` : value}
      </Text>
    </View>
  );
}
