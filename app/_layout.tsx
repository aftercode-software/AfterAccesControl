import React, { useEffect } from "react";
import { Slot, router } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "global.css";

function AuthCheck() {
  const { user } = useAuth();

  useEffect(() => {
    console.log("Checking user", user);
    if (!user) {
      router.replace("/login");
    } else {
      router.replace("/home");
    }
  }, [user]);

  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <GluestackUIProvider mode="light">
        <AuthCheck />
      </GluestackUIProvider>
    </AuthProvider>
  );
}
