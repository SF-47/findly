import React from "react";
import ScreenHeader from "../../components/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, ScrollView, TextInput, Pressable } from "react-native";
import ItemCard from "../../components/ItemCard";
import { itemCards } from "../../data/itemCards";

export default function BrowseScreen({ navigation }) {
  function openItemDetails(item) {
    navigation.getParent()?.navigate("ItemDetails", { item });
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Browse items"
        subtitle="Search lost and found reports submitted by students."
      />

      <View className="mb-5 h-12 flex-row items-center rounded-xl border border-slate-200 bg-white px-4  mt-7 dark:border-zinc-700 dark:bg-zinc-800">
        <Ionicons name="search-outline" size={20} color="#64748b" />
        <TextInput
          className="ml-3 flex-1 text-base text-slate-900 dark:text-white"
          placeholder="Search by item, place, or category"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View className="mb-5 flex-row">
        {["All", "Lost", "Found"].map((label, index) => (
          <View
            className={`mr-3 rounded-full px-4 py-2 ${
              index === 0
                ? "bg-blue-600 dark:bg-blue-500"
                : "bg-white dark:bg-zinc-900 dark:border dark:border-zinc-700"
            }`}
            key={label}
          >
            <Text
              className={`font-bold ${index === 0 ? "text-white" : "text-slate-600 dark:text-gray-300"}`}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {itemCards.map((item) => (
        <Pressable
          key={item.title}
          onPress={() => openItemDetails(item)}
        >
          <ItemCard item={item} />
        </Pressable>
      ))}
    </ScrollView>
  );
}
