import React from "react";
import { View, StyleSheet } from "react-native";
import PendingData from "./PendingData";
import ProfileIcon from "./ProfileIcon";

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <ProfileIcon />
      <PendingData />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 32,
    justifyContent: "space-between",
    alignContent: "center",
  },
});
