import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { FileText, BarChart3, User } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/hooks/useUserStore";
import { useAnalysisStore } from "@/hooks/useAnalysisStore";

export default function TabLayout() {
  const initializeUser = useUserStore(state => state.initialize);
  const initializeAnalysis = useAnalysisStore(state => state.initialize);

  useEffect(() => {
    // Initialize stores when app loads
    initializeUser();
    initializeAnalysis();
  }, [initializeUser, initializeAnalysis]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontWeight: "600",
          color: colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "AI Check",
          tabBarLabel: "Check",
          tabBarIcon: ({ color }) => <FileText size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}