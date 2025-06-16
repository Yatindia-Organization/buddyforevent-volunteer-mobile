import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useSegments, Slot } from "expo-router";
import { useGlobalInfo } from "@/context/GlobalContext";
import TopNavBar from "@/components/TopNavBar";

export default function AppLayout() {
  const { isLoggedIn } = useGlobalInfo();
  const router = useRouter();
  const segments = useSegments();

  // Only redirect once the layout has fully mounted and router is ready
  useEffect(() => {
    // if (!isLoggedIn) {
    //   // Only redirect if we're *inside* the (app) layout
    //   if (segments.length > 0 && segments[0] === "(app)") {
    //     // Using setTimeout to defer navigation until after layout mount
    //     setTimeout(() => {
    //       router.replace("/login");
    //     }, 0);
    //   }
    // }
    if (!isLoggedIn && segments[0] === "(app)") {
      setTimeout(() => {
        router.replace("/login");
      }, 0);
    }

  }, [isLoggedIn, segments, router]);

  // Show spinner while checking auth
  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopNavBar />
      <Slot />
    </View>
  );
}
