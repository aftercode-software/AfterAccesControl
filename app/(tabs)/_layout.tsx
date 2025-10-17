import TabIcon from "@/components/TabIcon";
import { Tabs } from "expo-router";
import { ArrowBigDown, ArrowBigUp, UserRound } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 0,
          fontFamily: "Inter_500Medium",
        },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#BDBDBD",
        tabBarHideOnKeyboard: false,
        tabBarStyle: {
          height: 65,
          backgroundColor: "#fff",
          paddingTop: 10,
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
                IconComponent={ArrowBigDown}
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
              IconComponent={ArrowBigUp}
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
              IconComponent={UserRound}
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
