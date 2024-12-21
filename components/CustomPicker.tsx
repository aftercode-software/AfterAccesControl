import { View, Text } from "react-native";

import { VStack } from "./ui/vstack";
import { Picker } from "@react-native-picker/picker";

export default function CustomPicker({
  className,
  arrayOpciones,
  tittle,
  placeholder,
  value,
  onChangeText,
}: {
  className?: string;
  arrayOpciones: string[];
  tittle: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <VStack className={"flex-1 " + className}>
      <Text className="text-[1.0rem] pl-1 font-bold text-gray-800 mb-1 font-inter">
        {tittle}
      </Text>
      <View className="border rounded-xl border-slate-500 h-14">
        <Picker
          placeholder="Vehiculo"
          selectedValue={value}
          onValueChange={(text) => onChangeText(text)}
        >
          <Picker.Item label="Vehiculo" value="" />
          {arrayOpciones.map((type) => (
            <Picker.Item
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              value={type}
            />
          ))}
        </Picker>
      </View>
    </VStack>
  );
}
