import { VStack } from "./ui/vstack";
import { Text } from "react-native";
import { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { HStack } from "./ui/hstack";

export default function BuscadorChapa({
  chapas,
  manejarSeleccionChapa,
}: {
  chapas: { chapa: string; cedula: string }[];
  manejarSeleccionChapa: (valor: string) => void;
}) {
  const [selected, setSelected] = useState("");

  const data = chapas.map((item) => ({
    key: item.chapa,
    value: `${item.chapa} - ${item.cedula}`,
  }));

  return (
    <HStack className="flex-1 items-center gap-2">
      <VStack className="flex-[1] space-y-1">
        <Text className="text-sm font-bold px-1 pb-1 text-gray-800 font-inter">
          Buscar por Chapa o Cédula
        </Text>

        <SelectList
          setSelected={(val: string) => {
            console.log("val", val.split(" - ")[0].trim());
            manejarSeleccionChapa(val.split(" - ")[0].trim());
            setSelected(val);
          }}
          data={data}
          save="value"
          placeholder="Selecciona una chapa o cédula"
          searchPlaceholder="Buscar..."
          boxStyles={{
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: "#F64C95",
            height: 48,
            justifyContent: "flex-start",
          }}
          dropdownStyles={{
            width: "100%",
            borderRadius: 10,
            maxHeight: 200,
            backgroundColor: "white",
            elevation: 3,
            borderColor: "#F64C95",
            position: "absolute",
            top: 45,
            zIndex: 10,
          }}
          inputStyles={{
            fontSize: 14, // Asegura que el tamaño sea consistente
            fontFamily: "Inter_400Regular",
            color: "#333",
          }}
          dropdownTextStyles={{
            fontSize: 15,
            fontFamily: "Inter_400Regular",
            color: "#333",
          }}
        />
      </VStack>
    </HStack>
  );
}
