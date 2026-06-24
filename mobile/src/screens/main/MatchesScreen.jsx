import React from "react";
import { ScrollView, View, Text } from "react-native";
import ScreenHeader from "../../components/ScreenHeader";
export default function MatchesScreen({ navigation }) {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="AI matches"
        subtitle="Possible connections between lost and found reports."
      />

      {[92, 78, 64].map((score, index) => (
        <View
          className="mb-4 mt-7 rounded-2xl bg-white p-5 dark:bg-zinc-900"
          key={score}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">
              Possible match
            </Text>
            <Text className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              {score}%
            </Text>
          </View>

          <View className="mt-5 flex-row">
            <View className="mr-3 flex-1 rounded-xl bg-red-50 p-3 dark:bg-zinc-800">
              <Text className="text-xs font-bold uppercase text-red-500">
                Lost
              </Text>
              <Text className="mt-2 font-bold text-slate-900 dark:text-white">
                {index === 0 ? "Black Backpack" : "Phone Charger"}
              </Text>
            </View>
            <View className="flex-1 rounded-xl bg-emerald-50 p-3 dark:bg-zinc-800">
              <Text className="text-xs font-bold uppercase text-emerald-600">
                Found
              </Text>
              <Text className="mt-2 font-bold text-slate-900 dark:text-white">
                {index === 0 ? "Dark Bag" : "USB-C Charger"}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
