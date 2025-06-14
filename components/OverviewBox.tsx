import { StyleSheet, Text, View } from "react-native";

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
    <View style={styles.box} className="border-slate-300 border-[1px]">
      <Text className="text-lg text-gray-700">{title}</Text>
      <Text className="text-2xl mt-2  font-semibold">
        {moneyStyle ? "$" : ""}
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "48%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
});
