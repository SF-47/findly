import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, TextInput, View, ActivityIndicator, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChangePasswordScreenProps } from "../../navigation/types";
import { changePassword } from "../../services/studentService";
import CustomAlert from "../../components/CustomAlert";

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

function PasswordField({ label, placeholder, value, onChangeText }: PasswordFieldProps) {
  const [isSecure, setIsSecure] = useState<boolean>(true);

  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </Text>
      <View className="h-14 flex-row items-center rounded-xl bg-white px-4 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
        <Ionicons name="lock-closed-outline" size={19} color="#94a3b8" />
        <TextInput
          className="ml-3 flex-1 text-base text-slate-900 dark:text-white"
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={isSecure}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          onPress={() => setIsSecure((prev) => !prev)}
          className="p-1"
        >
          <Ionicons
            name={isSecure ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#94a3b8"
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function ChangePasswordScreen({ navigation }: ChangePasswordScreenProps) {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
    onClose: () => void;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
    onClose: () => {},
  });

  function showCustomAlert(
    type: "success" | "error" | "info",
    title: string,
    message: string,
    onCloseCallback?: () => void
  ) {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      onClose: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        if (onCloseCallback) onCloseCallback();
      },
    });
  }

  async function handleSavePassword() {
    Keyboard.dismiss();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showCustomAlert("error", "Error", "Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      showCustomAlert("error", "Error", "New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showCustomAlert("error", "Error", "New password and confirmation do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await changePassword(currentPassword, newPassword);
      showCustomAlert(
        "success",
        "Success",
        "Your password has been changed successfully.",
        () => navigation.goBack()
      );
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Failed to change password. Please verify your current password.";
      showCustomAlert("error", "Incorrect Password", msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-zinc-950" edges={["top", "bottom"]}>
      {/* Header */}
      <View
        className="px-5 pt-4 pb-4 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800"
        style={{ zIndex: 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#64748b" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-3xl font-bold text-slate-900 dark:text-white">
              Change password
            </Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update the password used for your account.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/40">
          <View className="flex-row">
            <Ionicons name="shield-checkmark-outline" size={22} color="#2563eb" />
            <View className="ml-3 flex-1">
              <Text className="font-bold text-slate-900 dark:text-white">
                Keep it secure
              </Text>
              <Text className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                Use at least 8 characters with a mix of letters, numbers, and symbols.
              </Text>
            </View>
          </View>
        </View>

        <PasswordField
          label="Current password"
          placeholder="Enter current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <PasswordField
          label="New password"
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <PasswordField
          label="Confirm new password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable
          className={`mt-2 h-14 items-center justify-center rounded-xl bg-blue-600 ${isLoading ? "opacity-60" : ""}`}
          onPress={handleSavePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-base font-bold text-white">Save password</Text>
          )}
        </Pressable>
      </ScrollView>

      {/* Custom Modal Alert Overlay */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={alertConfig.onClose}
      />
    </SafeAreaView>
  );
}
