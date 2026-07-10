import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ScreenHeader";

// Mock data to preview the UI until Firebase is ready
const INITIAL_NOTIFICATIONS = [
  {
    id: "1",
    title: "New match found!",
    message: "A student reported finding an item that matches your lost backpack.",
    time: "2 hours ago",
    read: false,
    icon: "sparkles",
    color: "#2563eb",
    bg: "bg-blue-100 dark:bg-blue-900/40",
  },
  {
    id: "2",
    title: "Report published",
    message: "Your report for 'Found iPhone 13' is now live and searchable.",
    time: "1 day ago",
    read: true,
    icon: "checkmark-circle",
    color: "#059669",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  {
    id: "3",
    title: "Important update",
    message: "Please remember to securely meet up when exchanging lost items.",
    time: "3 days ago",
    read: true,
    icon: "information-circle",
    color: "#64748b",
    bg: "bg-slate-100 dark:bg-zinc-800",
  },
];

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  function markAllAsRead() {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  }

  function handleNotificationPress(id) {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-zinc-950">
      <View
        className="px-5 pb-4 bg-slate-50 dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800"
        style={{ paddingTop: Math.max(insets.top, 24) + 12, zIndex: 10 }}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 flex-row items-center">
            <Pressable
              className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-zinc-800"
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={22} color="#64748b" />
            </Pressable>
            <View>
              <Text className="text-2xl font-black text-slate-900 dark:text-white">
                Notifications
              </Text>
              {unreadCount > 0 ? (
                <Text className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {unreadCount} unread
                </Text>
              ) : (
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  You're all caught up
                </Text>
              )}
            </View>
          </View>

          {unreadCount > 0 && (
            <Pressable
              className="mt-1 rounded-full bg-slate-100 px-3 py-2 dark:bg-zinc-900"
              onPress={markAllAsRead}
            >
              <Text className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Mark all read
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center">
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900">
              <Ionicons name="notifications-off-outline" size={40} color="#94a3b8" />
            </View>
            <Text className="text-lg font-black text-slate-900 dark:text-white">
              No notifications yet
            </Text>
            <Text className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 px-10">
              When someone finds a match or updates your report, it will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            className={`mb-3 flex-row rounded-3xl p-4 ${
              item.read
                ? "bg-white dark:bg-zinc-900"
                : "bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30"
            }`}
            onPress={() => handleNotificationPress(item.id)}
          >
            <View className={`mr-4 h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>

            <View className="flex-1">
              <View className="flex-row items-start justify-between">
                <Text className={`flex-1 text-base font-bold ${item.read ? "text-slate-900 dark:text-white" : "text-blue-900 dark:text-blue-100"}`}>
                  {item.title}
                </Text>
                {!item.read && (
                  <View className="ml-2 h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-500 mt-1.5" />
                )}
              </View>

              <Text className={`mt-1 text-sm leading-5 ${item.read ? "text-slate-500 dark:text-slate-400" : "text-slate-700 dark:text-slate-300 font-medium"}`}>
                {item.message}
              </Text>

              <Text className="mt-2 text-xs font-semibold text-slate-400 dark:text-zinc-500">
                {item.time}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
