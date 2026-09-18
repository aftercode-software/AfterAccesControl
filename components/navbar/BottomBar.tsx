import React from "react";
import { Pressable, Text, View } from "react-native";
import { Tabs } from "expo-router";
import icons from "@/constants/icons";
import TabIcon from "@/components/navbar/TabIcon";
import { colors } from "@/styles/tokens";

type NativeTabBarProps = {
  state: {
    index: number;
    routes: Array<{ key: string; name: string }>;
  };
  descriptors: Record<
    string,
    {
      options: {
        title?: string;
        tabBarAccessibilityLabel?: string;
      };
    }
  >;
  navigation: {
    emit: (...args: any[]) => any;
    navigate: (name: string) => void;
  };
};

export default function BottomBar() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <NativeWindTabBar {...props} />}
    >
      <Tabs.Screen
        name="ingreso"
        options={{
          title: "Ingreso",
        }}
      />

      <Tabs.Screen
        name="salida"
        options={{
          title: "Salida",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
        }}
      />
    </Tabs>
  );
}

function NativeWindTabBar({ state, descriptors, navigation }: NativeTabBarProps) {
  return (
    <View className="min-h-[72px] flex-row items-center justify-center border-t border-line bg-canvas px-2 pb-2 pt-1">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label = options.title || route.name;
        const color = focused ? colors.ink : colors.slateMuted;
        const IconComponent =
          route.name === "ingreso"
            ? icons.IncomeIcon
            : route.name === "salida"
              ? icons.EgressIcon
              : icons.ConfigIcon;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            accessibilityLabel={options.tabBarAccessibilityLabel}
            accessibilityRole="tab"
            accessibilityState={focused ? { selected: true } : {}}
            className="min-h-[58px] flex-1 items-center justify-center py-1 active:opacity-70"
            key={route.key}
            onLongPress={onLongPress}
            onPress={onPress}
          >
            <TabIcon
              IconComponent={IconComponent}
              color={color}
              focused={focused}
              name={label}
            />
            <Text
              className={`mt-1 font-inter-medium text-[10px] ${
                focused ? "text-ink" : "text-slate-muted"
              }`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
