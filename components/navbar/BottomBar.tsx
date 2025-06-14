import { View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "@/constants/icons";
import TabIcon from "@/components/navbar/TabIcon";

export default function BottomBar() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 14,
          marginBottom: 0,
          fontFamily: "Poppins_400Regular",
        },
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#B1B1B1",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 70,
          backgroundColor: "#fff",
          paddingTop: 5,
          paddingBottom: 0,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: "hidden",
          paddingHorizontal: 10,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="ingreso"
        options={{
          title: "Ingreso",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TabIcon
                IconComponent={icons.IncomeIcon}
                color={color}
                name="Ingreso"
                focused={focused}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="salida"
        options={{
          title: "Salida",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              IconComponent={icons.EgressIcon}
              color={color}
              name="Salida"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              IconComponent={icons.ConfigIcon}
              color={color}
              name="Perfil"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
