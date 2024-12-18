import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import icons from "@/constants/icons";

const TabIcon = ({ IconComponent, color, name, focused }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <IconComponent color={color} />
      <Text className={`text-xs ${focused ? "text-primary" : "text-gray-500"}`}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#53B175",
        tabBarInactiveTintColor: "#BDBDBD",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 60,
          backgroundColor: "#fff",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: "hidden",
          paddingHorizontal: 20,
        },
      }}
    >
      <Tabs.Screen
        name="ingreso"
        options={{
          title: "Ingreso",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              IconComponent={icons.IncomeIcon}
              color={color}
              name="Ingreso"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="egreso"
        options={{
          title: "Egreso",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              IconComponent={icons.EgressIcon}
              color={color}
              name="Egreso"
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
};

export default TabsLayout;
