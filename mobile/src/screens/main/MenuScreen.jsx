import React, { useState, useEffect } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeButton from "../../components/ThemeButton";
import { getCurrentStudent } from "../../services/studentService";
import { removeToken } from "../../storage/tokenStorage";
import { resetToLogin } from "../../navigation/navigationRef";

function getInitials(name) {
  if (!name?.trim()) {
    return "S";
  }

  return name
    .trim()
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SectionTitle({ children }) {
  return (
    <Text className="mb-3 mt-6 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
      {children}
    </Text>
  );
}

function MenuRow({
  icon,
  label,
  subtitle,
  onPress,
  showDivider = true,
  trailing,
  iconColor = "#64748b",
  iconBg = "bg-slate-100 dark:bg-zinc-800",
}) {
  return (
    <Pressable disabled={!onPress} onPress={onPress}>
      <View
        className={`flex-row items-center px-4 py-4 ${
          showDivider ? "border-b border-slate-100 dark:border-zinc-800" : ""
        }`}
      >
        <View
          className={`mr-3 h-10 w-10 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>

        <View className="flex-1">
          <Text className="font-bold text-slate-900 dark:text-white">
            {label}
          </Text>
          {subtitle ? (
            <Text className="mt-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
              {subtitle}
            </Text>
          ) : null}
        </View>

        {trailing || (
          <Ionicons name="chevron-forward" size={19} color="#94a3b8" />
        )}
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

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await removeToken();
    resetToLogin();
  }

  useEffect(() => {
    fetchStudentData();
  }, []);

  const displayName = isLoading
    ? "Loading profile..."
    : studentData.fullName || "Student";
  const initials = getInitials(studentData.fullName);

  return (
    <View className="flex-1">
      <View className="pb-4">
        <ScreenHeader
          title="Menu"
          subtitle="Your account, security, and app preferences."
        />
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2 items-center rounded-3xl bg-white p-5 dark:bg-zinc-900">
        <View className="items-center">
          <View className="relative">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
              <Text className="text-3xl font-black text-white">{initials}</Text>
            </View>

            <View className="absolute bottom-1 right-1 h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-green-500 dark:border-zinc-900">
              <Ionicons name="checkmark" size={15} color="#ffffff" />
            </View>
          </View>

          <View className="mt-3 rounded-full bg-slate-100 px-3 py-1 dark:bg-zinc-800">
            <Text className="text-xs font-black text-slate-600 dark:text-zinc-300">
              {studentData.universityShortName || "Student"}
            </Text>
          </View>
        </View>

        <Text className="mt-4 text-xl font-black text-slate-900 dark:text-white">
          {displayName}
        </Text>
      </View>

      <SectionTitle>Account</SectionTitle>
      <View className="overflow-hidden rounded-3xl bg-white dark:bg-zinc-900">
        <MenuRow
          icon="person-outline"
          label="Profile"
          subtitle="View and edit your personal details"
          onPress={() => navigation.navigate("Profile")}
        />
        <MenuRow
          icon="document-text-outline"
          label="My reports"
          subtitle="Lost and found items you posted"
          onPress={() => navigation.navigate("MyReports")}
        />
        <MenuRow
          icon="chatbubbles-outline"
          label="Messages"
          subtitle="Coordinate meetups for your items"
          onPress={() => navigation.navigate("Chats")}
          showDivider={false}
        />
      </View>

      <SectionTitle>Preferences</SectionTitle>
      <View className="overflow-hidden rounded-3xl bg-white dark:bg-zinc-900">
        <MenuRow
          icon="color-palette-outline"
          label="Appearance"
          subtitle="Switch between light and dark mode"
          trailing={<ThemeButton />}
        />
        <MenuRow
          icon="notifications-outline"
          label="Notifications"
          subtitle="Alerts about matches and reports"
          onPress={() => navigation.navigate("Notifications")}
          showDivider={false}
        />
      </View>

      <SectionTitle>Security</SectionTitle>
      <View className="overflow-hidden rounded-3xl bg-white dark:bg-zinc-900">
        <MenuRow
          icon="lock-closed-outline"
          label="Change password"
          subtitle="Keep your account protected"
          onPress={() => navigation.navigate("ChangePassword")}
          showDivider={false}
        />
      </View>

      <Pressable
        className="mt-6 flex-row items-center justify-center rounded-2xl bg-red-50 px-4 py-4 dark:bg-red-950/30"
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        <Text className="ml-2 font-black text-red-600 dark:text-red-400">
          Log out
        </Text>
      </Pressable>
      </ScrollView>
      {isLoggingOut && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/40">
          <View className="items-center justify-center rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-800">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-4 font-bold text-slate-900 dark:text-white">
              Logging out...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
