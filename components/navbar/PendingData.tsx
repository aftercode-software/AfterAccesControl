import { useData } from "@/hooks/useData";
import { CircleFadingArrowUp } from "lucide-react-native";
import { Text, View } from "react-native";

export default function PendingData() {
  const dataContext = useData();
  const { pendingData, retryPendingData } = dataContext;

  if (pendingData.length === 1) {
    return null;
  }
  return (
    <View
      onTouchEnd={() => retryPendingData()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEEED7",
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 15,
      }}
    >
      <Text
        style={{
          color: "#F07C29",
          fontWeight: "bold",
          fontSize: 16,
          marginRight: 10,
        }}
      >
        {pendingData.length}
      </Text>
      <CircleFadingArrowUp color="#F07C29" />
    </View>
  );
}
