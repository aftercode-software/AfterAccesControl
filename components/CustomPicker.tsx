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
      <Text className="text-sm font-bold px-1 pb-1 text-gray-800 font-inter">
        {tittle}
      </Text>
      <View
        style={{
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: "#ccc",
          height: 50,
          overflow: "hidden",
          justifyContent: "center",
        }}
      >
        <Picker
          selectedValue={value}
          onValueChange={(text) => onChangeText(text)}
          style={{
            width: "100%",
            color: "#333",
            fontSize: 14,
          }}
          itemStyle={{
            fontSize: 14,
          }}
        >
          <Picker.Item
            label={placeholder || "Seleccione una opción"}
            value=""
            style={{ color: "#888" }}
          />
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
