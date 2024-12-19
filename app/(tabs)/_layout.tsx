import { View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "@/constants/icons";
import TabIcon from "@/components/TabIcon";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#F64C95",
        tabBarInactiveTintColor: "#BDBDBD",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 60,
          backgroundColor: "#fff",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: "hidden",
          paddingHorizontal: 10,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
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
};

export default TabsLayout;
