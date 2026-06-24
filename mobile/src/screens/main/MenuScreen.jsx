import React, { useState, useEffect } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import { Text, View, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeButton from "../../components/ThemeButton";
import { getCurrentStudent } from "../../services/studentService";
import { removeToken } from "../../storage/tokenStorage";

function MenuRow({ icon, label, onPress, showDivider = true }) {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`flex-row items-center px-4 py-4 ${
          showDivider ? "border-b border-slate-100 dark:border-zinc-800" : ""
        }`}
      >
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800">
          <Ionicons name={icon} size={20} color="#64748b" />
        </View>
        <Text className="flex-1 font-semibold text-slate-800 dark:text-slate-100">
          {label}
        </Text>
        <Ionicons name="chevron-forward" size={19} color="#94a3b8" />
      </View>
    </Pressable>
  );
}

export default function MenuScreen({ navigation }) {
  const [studentData, setStudentData] = useState({
    fullName: "",
    email: "",
    universityId: "",
    universityStudentId: "",
    universityShortName: "",
    universityFullName: "",
    universityBranch: "",
    phoneNumber: "",
    universityCardImageUrl: "",
    createdAt: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function fetchStudentData() {
    try {
      setIsLoading(true);

      const student = await getCurrentStudent();

      setStudentData({
        fullName: student.fullName,
        email: student.email,
        universityId: student.universityId,
        universityStudentId: student.universityStudentId,
        universityShortName: student.universityShortName,
        universityFullName: student.universityFullName,
        universityBranch: student.universityBranch,
        phoneNumber: student.phoneNumber,
        universityCardImageUrl: student.universityCardImageUrl,
        createdAt: student.createdAt,
      });
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    await removeToken();
    navigation
      .getParent()
      ?.getParent()
      ?.getParent()
      ?.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
  }

  useEffect(() => {
    fetchStudentData();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-zinc-950"
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Menu"
        subtitle="Your account, security, and app preferences."
      />

      <View className="mb-5 mt-7 flex-row items-center justify-between rounded-2xl bg-white px-4 py-4 dark:bg-zinc-900">
        <View>
          <Text className="font-semibold text-slate-900 dark:text-white">
            Settings
          </Text>
          <Text className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Switch between light and dark mode
          </Text>
        </View>
        <ThemeButton />
      </View>

      <View className="mb-5 items-center rounded-3xl bg-white p-6 dark:bg-zinc-900">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 dark:bg-blue-500">
          <Text className="text-3xl font-black text-white">S</Text>
        </View>
        <Text className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          {studentData.fullName}
        </Text>
        <Text className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          {studentData.email}
        </Text>
      </View>

      <View className="overflow-hidden rounded-2xl bg-white dark:bg-zinc-900">
        <MenuRow
          icon="person-outline"
          label="Profile"
          onPress={() => navigation.navigate("Profile")}
        />
        <MenuRow
          icon="document-text-outline"
          label="My reports"
          onPress={() => navigation.navigate("MyReports")}
        />
        <MenuRow icon="notifications-outline" label="Notifications" />
        <MenuRow
          icon="lock-closed-outline"
          label="Change password"
          onPress={() => navigation.navigate("ChangePassword")}
          showDivider={false}
        />
      </View>

      <Pressable
        className="mt-4 h-12 items-center justify-center rounded-xl bg-red-600"
        onPress={handleLogout}
      >
        <Text className="font-bold text-white">Log out</Text>
      </Pressable>
    </ScrollView>
  );
}
