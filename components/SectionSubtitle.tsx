import { Text } from "react-native";

export default function SectionSubTitle({ title }: { title: string }) {
  return (
    <Text className="font-inter-semibold text-[17px] leading-[21px] tracking-[-0.25px] text-ink">
      {title}
    </Text>
  );
}
