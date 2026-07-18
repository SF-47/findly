import React from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PendingVerificationScreenProps } from "../../navigation/types";
import { removeToken } from "../../storage/tokenStorage";

export default function PendingVerificationScreen({
  navigation,
}: PendingVerificationScreenProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  async function handleReturnToLogin(): Promise<void> {
    await removeToken();
    navigation.replace("Login");
  }

  return (
    <View
      className="flex-1 bg-slate-50 dark:bg-zinc-950"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#09090b" : "#f8fafc"}
      />

      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/15">
          <Ionicons
            name="hourglass-outline"
            size={34}
            color={isDark ? "#facc15" : "#ca8a04"}
          />
        </View>

        <Text className="mb-3 text-center text-2xl font-extrabold text-slate-900 dark:text-white">
          Waiting for Verification
        </Text>

        <Text className="text-center text-base leading-6 text-slate-500 dark:text-zinc-400">
          Your account was created successfully. Please wait until your
          university admin verifies your student card.
        </Text>

        <Pressable
          className="mt-8 h-14 w-full items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500"
          onPress={handleReturnToLogin}
        >
          <Text className="text-base font-extrabold text-white">
            Return to Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
