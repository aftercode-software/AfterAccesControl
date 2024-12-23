import React, { useEffect, useState, useRef } from "react";
import { View, Animated } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import "global.css";

export default function Index() {
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !loading) {
      if (user) {
        router.replace("/ingreso");
      } else {
        router.replace("/login");
      }
    }
  }, [isMounted, user, loading]);

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 2,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Animated.Image
        source={require("/assets/logo2.png")}
        style={{
          width: 200,
          height: 220,
          transform: [{ rotate: rotateInterpolate }],
        }}
      />
    </View>
  );
}
