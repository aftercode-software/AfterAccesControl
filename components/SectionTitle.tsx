import { Text } from "react-native";

export default function SectionTitle({ title }: { title: string }) {
  return (
    <Text
      className="text-4xl mb-6 w-full text-center text-black"
      style={{ fontFamily: "Poppins_600SemiBold" }}
    >
      {title}
    </Text>
  );
}
