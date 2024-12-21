import { TextInput, View, Text } from "react-native";
import { VStack } from "./ui/vstack";

export default function CustomInput({
  tittle,
  placeholder,
  value,
  onChangeText,
}: {
  tittle: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <VStack className="flex-[1.4] space-y-1">
      <Text className="text-sm font-bold px-1 pb-1 text-gray-800 font-inter">
        {tittle}
      </Text>
      <View>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => onChangeText(text)}
          style={{ borderRadius: 10, borderWidth: 1.5, borderColor: "#ccc" }}
          className="w-full h-12 px-4 text-base"
        />
      </View>
    </VStack>
  );
}
