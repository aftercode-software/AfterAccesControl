import { Text } from "react-native";

export default function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="font-inter-semibold text-[30px] leading-[33px] tracking-[-0.9px] text-ink">
      {title}
    </Text>
  );
}
