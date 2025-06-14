import { Text } from "react-native";

export default function SectionSubTitle({ title }: { title: string }) {
  return (
    <Text
      className="text-2xl mb-6 w-full text-left text-black"
      style={{ fontFamily: "Poppins_500Medium" }}
    >
      {title}
    </Text>
  );
}
