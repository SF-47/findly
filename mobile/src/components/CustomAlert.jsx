import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CustomAlert({
  visible,
  type = "success",
  title,
  message,
  buttonText = "OK",
  onClose,
  showCancelButton = false,
  cancelButtonText = "Cancel",
  onCancel,
}) {
  const isSuccess = type === "success";
  const isError = type === "error";

  const iconName = isSuccess
    ? "checkmark-circle"
    : isError
      ? "close-circle"
      : "information-circle";

  const iconColor = isSuccess ? "#16a34a" : isError ? "#dc2626" : "#2563eb";

  const bgColor = isSuccess
    ? "bg-green-100 dark:bg-green-900/30"
    : isError
      ? "bg-red-100 dark:bg-red-900/30"
      : "bg-blue-100 dark:bg-blue-900/30";

  const buttonColor = isSuccess
    ? "bg-green-600"
    : isError
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 px-10">
        <View className="w-full max-w-sm rounded-2xl bg-white p-5 dark:bg-zinc-900">
          <View className="items-center">
            <View
              className={`mb-3 h-12 w-12 items-center justify-center rounded-full ${bgColor}`}
            >
              <Ionicons name={iconName} size={30} color={iconColor} />
            </View>

            <Text className="text-center text-xl font-black text-slate-900 dark:text-white">
              {title}
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-slate-500 dark:text-slate-400">
              {message}
            </Text>
          </View>

          {showCancelButton ? (
            <View className="mt-5 flex-row">
              <Pressable
                className="mr-3 h-11 flex-1 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800"
                onPress={onCancel || onClose}
              >
                <Text className="text-sm font-black text-slate-600 dark:text-slate-300">{cancelButtonText}</Text>
              </Pressable>
              <Pressable
                className={`h-11 flex-1 items-center justify-center rounded-xl ${buttonColor}`}
                onPress={onClose}
              >
                <Text className="text-sm font-black text-white">{buttonText}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              className={`mt-5 h-11 items-center justify-center rounded-xl ${buttonColor}`}
              onPress={onClose}
            >
              <Text className="text-sm font-black text-white">{buttonText}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}
