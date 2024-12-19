import { View, Text, StyleSheet } from "react-native";
import React from "react";

interface TabIconProps {
  IconComponent: React.ComponentType<{ color: string }>;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({
  IconComponent,
  color,
  name,
  focused,
}) => {
  return (
    <View style={styles.container}>
      <IconComponent color={color} />
      <Text style={[styles.text, focused && styles.focusedText]}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    minWidth: 80, // Aumenta el ancho mínimo
  },
  text: {
    fontSize: 12,
    color: "#BDBDBD", // Color inactivo
  },
  focusedText: {
    color: "#F64C95", // Color activo
  },
});

export default TabIcon;
