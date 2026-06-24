import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../../components/ScreenHeader";

const reportTypes = [
  {
    key: "lost",
    title: "Lost item",
    subtitle: "I need help finding something",
    icon: "alert-circle-outline",
    color: "#dc2626",
  },
  {
    key: "found",
    title: "Found item",
    subtitle: "I want to return something",
    icon: "hand-left-outline",
    color: "#059669",
  },
];

const fields = [
  { label: "Item name", placeholder: "Black backpack, ID card..." },
  { label: "Category", placeholder: "Electronics, documents, bags..." },
  { label: "Color", placeholder: "Black, Red ...." },
  { label: "Location", placeholder: "Library, lab, cafeteria..." },
];

export default function ReportScreen() {
  const [reportType, setReportType] = useState("lost");

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 28 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Report item"
        subtitle="Create a clear report so matches can be found faster."
      />

      <View className="mt-7 rounded-3xl bg-white p-4 dark:bg-zinc-900">
        <Text className="mb-3 text-sm font-bold uppercase text-gray-500 dark:text-gray-400">
          What happened?
        </Text>

        <View className="flex-row gap-3">
          {reportTypes.map((type) => {
            const isSelected = reportType === type.key;

            return (
              <Pressable
                className={`flex-1 rounded-2xl p-4 ${
                  isSelected
                    ? "bg-blue-50 dark:bg-zinc-800"
                    : "bg-gray-50 dark:bg-zinc-800"
                }`}
                key={type.key}
                onPress={() => setReportType(type.key)}
              >
                <View className="mb-4 flex-row items-center justify-between">
                  <Ionicons name={type.icon} size={26} color={type.color} />
                  <View
                    className={`h-5 w-5 rounded-full ${
                      isSelected
                        ? "bg-blue-500"
                        : "bg-gray-300 dark:bg-zinc-600"
                    }`}
                  />
                </View>
                <Text className="text-base font-bold text-gray-900 dark:text-white">
                  {type.title}
                </Text>
                <Text className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  {type.subtitle}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-white p-4 dark:bg-zinc-900">
        <Text className="mb-4 text-sm font-bold uppercase text-gray-500 dark:text-gray-400">
          Item details
        </Text>

        {fields.map((field) => (
          <View className="mb-4" key={field.label}>
            <Text className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {field.label}
            </Text>
            <TextInput
              className="h-12 rounded-xl bg-gray-50 px-4 text-gray-900 dark:bg-zinc-800 dark:text-white"
              placeholder={field.placeholder}
              placeholderTextColor="#71717a"
            />
          </View>
        ))}

        <View>
          <Text className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Description
          </Text>
          <TextInput
            className="min-h-28 rounded-xl bg-gray-50 px-4 py-3 text-gray-900 dark:bg-zinc-800 dark:text-white"
            multiline
            placeholder="Add color, brand, unique marks, or anything that helps identify it."
            placeholderTextColor="#71717a"
            textAlignVertical="top"
          />
        </View>
      </View>

      <Pressable className="mt-5 h-14 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500">
        <Text className="text-base font-bold text-white">Submit report</Text>
      </Pressable>
    </ScrollView>
  );
}
