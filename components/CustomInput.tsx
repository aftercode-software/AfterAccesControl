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
    <VStack className="flex-[1.4]">
      <Text className="text-[1.0rem] font-bold text-gray-800  mb-1 font-inter">
        {tittle}
      </Text>
      <View className="w-full border rounded-xl focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-primary">
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => onChangeText(text)}
          className="w-full h-12 px-3 text-base text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none font-inter"
        />
      </View>
    </VStack>
  );
}
