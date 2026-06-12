import React, { useState, useEffect } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import { Text, View, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeButton from "../../components/ThemeButton";
import { getCurrentStudent } from "../../services/studentService";

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
    }
  }

  useEffect(() => {
    fetchStudentData();
  }, []);

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Menu"
        subtitle="Your account, security, and app preferences."
      />

      <View className="mt-7 mb-5 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-900">
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

      <View className="mb-5 items-center rounded-3xl border border-slate-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
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

      <Pressable onPress={() => navigation.navigate("Profile")}>
        <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-900">
          <Text className="font-semibold text-slate-800 dark:text-slate-100">
            Profile
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </View>
      </Pressable>
      <Pressable>
        <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-900">
          <Text className="font-semibold text-slate-800 dark:text-slate-100">
            My reports
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </View>
      </Pressable>
      <Pressable>
        <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-900">
          <Text className="font-semibold text-slate-800 dark:text-slate-100">
            Notifications
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </View>
      </Pressable>
      <Pressable>
        
        <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-4 dark:border-zinc-700 dark:bg-zinc-900">
          <Text className="font-semibold text-slate-800 dark:text-slate-100">
            Change password
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </View>
      </Pressable>

      <Pressable
        className="mt-4 h-12 items-center justify-center rounded-xl bg-red-600"
        onPress={() => navigation.replace("Login")}
      >
        <Text className="font-bold text-white">Log out</Text>
      </Pressable>
    </ScrollView>
  );
}
