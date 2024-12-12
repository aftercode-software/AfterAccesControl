
import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View > 
        <Text className="text-3xl p-4 text-black">Home</Text>
        <Link  href="/login" className="text-blue-500">Login</Link>
       
    </View>
  );
}