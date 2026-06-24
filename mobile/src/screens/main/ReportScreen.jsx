import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../../components/ScreenHeader";

const reportTypes = [
  {
    key: "lost",
    title: "Lost",
    label: "I lost something",
    hint: "Create a report so matching can search found items.",
    icon: "alert-circle-outline",
    color: "#e11d48",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-600 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
  },
  {
    key: "found",
    title: "Found",
    label: "I found something",
    hint: "Share what you found so the owner can identify it.",
    icon: "checkmark-circle-outline",
    color: "#059669",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
];

const detailFields = [
  {
    key: "itemName",
    label: "Item name",
    icon: "pricetag-outline",
    placeholder: "Backpack, student ID, USB-C charger",
  },
  {
    key: "category",
    label: "Category",
    icon: "grid-outline",
    placeholder: "Choose category",
    actionIcon: "chevron-down",
  },
  {
    key: "color",
    label: "Color",
    icon: "color-palette-outline",
    placeholder: "Black, red, silver",
  },
  {
    key: "location",
    label: "Location",
    icon: "location-outline",
    placeholder: "Library, cafeteria, lab",
  },
];

function TypeCard({ type, isSelected, onPress }) {
  return (
    <Pressable
      className={`flex-1 rounded-2xl border p-4 ${
        isSelected
          ? `${type.bg} ${type.border}`
          : "border-transparent bg-white dark:bg-zinc-900"
      }`}
      onPress={onPress}
    >
      <View className="mb-4 flex-row items-center justify-between">
        <View
          className={`h-11 w-11 items-center justify-center rounded-2xl ${
            isSelected ? "bg-white dark:bg-zinc-900" : type.bg
          }`}
        >
          <Ionicons name={type.icon} size={24} color={type.color} />
        </View>

        <View
          className={`h-6 w-6 items-center justify-center rounded-full ${
            isSelected ? "bg-blue-600" : "bg-slate-200 dark:bg-zinc-700"
          }`}
        >
          {isSelected ? (
            <Ionicons name="checkmark" size={15} color="#ffffff" />
          ) : null}
        </View>
      </View>

      <Text className="text-lg font-black text-slate-900 dark:text-white">
        {type.title}
      </Text>
      <Text className={`mt-1 text-xs font-bold uppercase ${type.text}`}>
        {type.label}
      </Text>
      <Text className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {type.hint}
      </Text>
    </Pressable>
  );
}

function FormField({ field }) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
        {field.label}
      </Text>
      <View className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800">
        <Ionicons name={field.icon} size={19} color="#64748b" />
        <TextInput
          className="ml-3 flex-1 text-base font-semibold text-slate-900 dark:text-white"
          placeholder={field.placeholder}
          placeholderTextColor="#94a3b8"
          editable={!field.actionIcon}
        />
        {field.actionIcon ? (
          <Ionicons name={field.actionIcon} size={18} color="#94a3b8" />
        ) : null}
      </View>
    </View>
  );
}

export default function ReportScreen() {
  const [reportType, setReportType] = useState("lost");
  const selectedType = reportTypes.find((type) => type.key === reportType);
  const dateLabel = reportType === "lost" ? "Lost date" : "Found date";
  const datePlaceholder =
    reportType === "lost" ? "When did you lose it?" : "When did you find it?";

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Report item"
        subtitle="Add the key details students need to recognize the item."
      />

      <View className="mt-7 rounded-3xl bg-blue-600 p-5 dark:bg-blue-500">
        <View className="flex-row items-start">
          <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Ionicons name="sparkles-outline" size={25} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-black text-white">
              Clear reports match faster
            </Text>
            <Text className="mt-2 text-sm leading-5 text-blue-100">
              Use a specific name, exact place, color, and one useful photo.
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-5">
        <Text className="mb-3 text-sm font-black uppercase text-slate-500 dark:text-slate-400">
          Report type
        </Text>
        <View className="flex-row gap-3">
          {reportTypes.map((type) => (
            <TypeCard
              key={type.key}
              type={type}
              isSelected={reportType === type.key}
              onPress={() => setReportType(type.key)}
            />
          ))}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-white p-5 dark:bg-zinc-900">
        <View className="mb-5 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-black text-slate-900 dark:text-white">
              Item details
            </Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Required information for the report.
            </Text>
          </View>
          <View className={`rounded-full px-3 py-1 ${selectedType.bg}`}>
            <Text
              className={`text-xs font-black uppercase ${selectedType.text}`}
            >
              {selectedType.title}
            </Text>
          </View>
        </View>

        {detailFields.map((field) => (
          <FormField field={field} key={field.key} />
        ))}

        <View className="mb-4">
          <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            {dateLabel}
          </Text>
          <Pressable className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800">
            <Ionicons name="calendar-outline" size={19} color="#64748b" />
            <Text className="ml-3 flex-1 text-base font-semibold text-slate-400">
              {datePlaceholder}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#94a3b8" />
          </Pressable>
        </View>

        <View>
          <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            Description
          </Text>
          <TextInput
            className="min-h-32 rounded-2xl bg-slate-50 px-4 py-4 text-base font-semibold leading-6 text-slate-900 dark:bg-zinc-800 dark:text-white"
            multiline
            placeholder="Add brand, unique marks, contents, or anything only the owner might know."
            placeholderTextColor="#94a3b8"
            textAlignVertical="top"
          />
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-white p-5 dark:bg-zinc-900">
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-black text-slate-900 dark:text-white">
              Item photo
            </Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add one clear image when available.
            </Text>
          </View>
          <Ionicons name="image-outline" size={24} color="#64748b" />
        </View>

        <Pressable className="h-40 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40">
            <Ionicons name="cloud-upload-outline" size={28} color="#2563eb" />
          </View>
          <Text className="mt-3 text-base font-black text-slate-900 dark:text-white">
            Upload photo
          </Text>
          <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            JPG or PNG, clear front view preferred
          </Text>
        </Pressable>
      </View>

      <View className="mt-5 rounded-3xl bg-blue-50 p-5 dark:bg-zinc-900">
        <View className="flex-row">
          <Ionicons name="shield-checkmark-outline" size={23} color="#2563eb" />
          <View className="ml-3 flex-1">
            <Text className="font-black text-slate-900 dark:text-white">
              Privacy tip
            </Text>
            <Text className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
              Avoid sharing passwords, private codes, or full document numbers
              in the description.
            </Text>
          </View>
        </View>
      </View>

      <Pressable className="mt-5 h-14 flex-row items-center justify-center rounded-2xl bg-blue-600 dark:bg-blue-500">
        <Ionicons name="send-outline" size={19} color="#ffffff" />
        <Text className="ml-2 text-base font-black text-white">
          Preview report
        </Text>
      </Pressable>
    </ScrollView>
  );
}
