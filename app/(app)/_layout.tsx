import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import TopNavBar from "../../components/TopNavBar";
import { useGlobalInfo } from "../../context/GlobalContext";

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
      console.log(isLoggedIn, segments, router, "layout")
      setTimeout(() => {
        router.replace("/login");
      }, 100);
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
