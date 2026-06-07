import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../../components/ScreenHeader";

function DemoButton({ icon, label, onPress }) {
  return (
    <Pressable
      className="mb-3 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-900"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/40">
          <Ionicons name={icon} size={21} color="#3b82f6" />
        </View>
        <Text className="font-bold text-gray-900 dark:text-white">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </Pressable>
  );
}

function BottomSheet({ visible, onClose }) {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="rounded-t-3xl border border-gray-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Filter items
            </Text>
            <Pressable onPress={onClose}>
              <Text className="font-bold text-blue-600 dark:text-blue-400">
                Close
              </Text>
            </Pressable>
          </View>
          {["All items", "Lost only", "Found only", "Near me"].map((label) => (
            <View
              className="mb-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-zinc-800"
              key={label}
            >
              <Text className="font-semibold text-gray-800 dark:text-white">
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

function ActionSheet({ visible, onClose }) {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <View className="rounded-t-3xl bg-white p-5 dark:bg-zinc-900">
          {["Edit report", "Share", "Mark as resolved", "Delete"].map(
            (label) => (
              <Pressable
                className="h-14 justify-center border-b border-gray-100 dark:border-zinc-800"
                key={label}
              >
                <Text
                  className={`text-base font-semibold ${
                    label === "Delete"
                      ? "text-red-500"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            ),
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

function ConfirmDialog({ visible, onCancel, onConfirm }) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Delete report?
          </Text>
          <Text className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            This is useful before destructive actions like deleting a report or
            cancelling a claim.
          </Text>
          <View className="mt-5 flex-row gap-3">
            <Pressable
              className="h-12 flex-1 items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800"
              onPress={onCancel}
            >
              <Text className="font-bold text-gray-700 dark:text-white">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              className="h-12 flex-1 items-center justify-center rounded-xl bg-red-600"
              onPress={onConfirm}
            >
              <Text className="font-bold text-white">Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Toast({ visible, message }) {
  if (!visible) return null;

  return (
    <View className="absolute left-0 right-0 top-2 z-50 rounded-2xl bg-zinc-900 px-4 py-3 dark:bg-zinc-800">
      <Text className="text-center font-semibold text-white">{message}</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View className="mt-2 items-center rounded-2xl border border-gray-200 bg-white p-7 dark:border-zinc-700 dark:bg-zinc-900">
      <Ionicons name="search-outline" size={42} color="#60a5fa" />
      <Text className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        No matches yet
      </Text>
      <Text className="mt-2 text-center text-sm leading-6 text-gray-500 dark:text-gray-400">
        Empty states explain what happened and what the user can do next.
      </Text>
    </View>
  );
}

export default function ComponentsDemoScreen() {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  function showToast(message = "Report submitted successfully") {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1800);
  }

  return (
    <View className="flex-1">
      <Toast message="Report submitted successfully" visible={toastVisible} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 92 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Mobile UI kit"
          subtitle="Useful mobile patterns for Smart Lost & Found."
        />

        <View className="mt-7">
          <DemoButton
            icon="albums-outline"
            label="Bottom sheet"
            onPress={() => setBottomSheetVisible(true)}
          />
          <DemoButton
            icon="ellipsis-horizontal-circle-outline"
            label="Action sheet"
            onPress={() => setActionSheetVisible(true)}
          />
          <DemoButton
            icon="warning-outline"
            label="Confirm dialog"
            onPress={() => setConfirmVisible(true)}
          />
          <DemoButton
            icon="chatbox-ellipses-outline"
            label="Toast"
            onPress={() => showToast()}
          />
        </View>

        <EmptyState />
      </ScrollView>

      <Pressable
        className="absolute bottom-5 right-0 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg dark:bg-blue-500"
        onPress={() => setBottomSheetVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </Pressable>

      <BottomSheet
        onClose={() => setBottomSheetVisible(false)}
        visible={bottomSheetVisible}
      />
      <ActionSheet
        onClose={() => setActionSheetVisible(false)}
        visible={actionSheetVisible}
      />
      <ConfirmDialog
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          showToast("Report deleted");
        }}
        visible={confirmVisible}
      />
    </View>
  );
}
