import React from "react";
import ScreenHeader from "../../components/ScreenHeader";
import { Text, View, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeButton from "../../components/ThemeButton";

export default function ProfileScreen({ navigation }) {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Profile"
        subtitle="Your account, security, and app preferences."
      />

      <View className="mt-7 mb-5 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-900">
        <View>
          <Text className="font-semibold text-slate-900 dark:text-white">
            Theme
          </Text>
          <Text className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Switch between light and dark mode
          </Text>
        </View>
        <ThemeButton />
      </View>

      <View className="mb-5 items-center rounded-3xl border border-slate-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 dark:bg-blue-500">
          <Text className="text-3xl font-black text-white">S</Text>
        </View>
        <Text className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Sami Student
        </Text>
        <Text className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          student@university.edu
        </Text>
      </View>

      {["My reports", "Notifications", "Change password"].map(
        (label) => (
          <View
            className="mb-3 flex-row items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-900"
            key={label}
          >
            <Text className="font-semibold text-slate-800 dark:text-slate-100">{label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </View>
        ),
      )}

      <Pressable
        className="mt-4 h-12 items-center justify-center rounded-xl bg-red-600"
        onPress={() => navigation.replace("Login")}
      >
        <Text className="font-bold text-white">Log out</Text>
      </Pressable>
    </ScrollView>
  );
}
