import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState, useEffect } from "react";
import {
  getCurrentStudent,
  updateCurrentStudent,
} from "../../services/studentService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ProfileField({ label, value, ...inputProps }) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </Text>
      <TextInput
        className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        value={value ?? ""}
        placeholderTextColor="#94a3b8"
        {...inputProps}
      />
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [studentData, setStudentData] = useState({
    fullName: "",
    email: "",
    universityId: "",
    universityStudentId: "",
    universityShortName: "",
    universityFullName: "",
    universityBranch: "",
    phoneNumber: "",
    isVerified: null,
    universityCardImageUrl: "",
    createdAt: "",
  });
  const [isLoading, setIsLoading] = useState(true);

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
        isVerified: student.isVerified,
        universityCardImageUrl: student.universityCardImageUrl,
        createdAt: student.createdAt,
      });
    } catch (error) {
      console.log("PROFILE ERROR:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentData();
  }, []);

  const memberSince = new Date(studentData.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  async function handleSave() {
    const fullName = studentData.fullName.trim();
    const phoneNumber = studentData.phoneNumber.trim();

    if (fullName.length < 3) {
      Alert.alert("Invalid name", "Full name must be at least 3 characters.");
      return;
    }

    if (!/^(03|70|71|76|78|79|81)\d{6}$/.test(phoneNumber)) {
      Alert.alert(
        "Invalid phone number",
        "Enter a valid Lebanese mobile number.",
      );
      return;
    }

    try {
      setIsLoading(true);

      const updatedStudent = await updateCurrentStudent({
        fullName,
        phoneNumber,
      });

      setStudentData((current) => ({ ...current, ...updatedStudent }));
      Alert.alert("Profile updated", "Your changes were saved successfully.");
    } catch (error) {
      const responseData = error?.response?.data;
      const message =
        responseData?.errors?.[0] ||
        responseData?.message ||
        "Could not update your profile. Please try again.";

      Alert.alert("Update failed", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-zinc-950">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: Math.max(insets.top, 24) + 12,
        }}
        keyboardShouldPersistTaps="handled"
        pointerEvents={isLoading ? "none" : "auto"}
        showsVerticalScrollIndicator={false}
        style={{ opacity: isLoading ? 0.35 : 1 }}
      >
        <View className="mb-6 flex-row items-center">
          <Pressable
            className="mr-4 h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#64748b" />
          </Pressable>
          <View>
            <Text className="text-3xl font-bold text-slate-900 dark:text-white">
              Profile
            </Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View and update your personal information.
            </Text>
          </View>
        </View>

        <View className="mb-6 items-center rounded-3xl border border-slate-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-blue-600">
            <Text className="text-3xl font-black uppercase text-white">
              {studentData.fullName.charAt(0)}
            </Text>
          </View>
          <Text className="mt-4 text-xl font-bold capitalize text-slate-900 dark:text-white">
            {studentData.fullName}
          </Text>
          <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {studentData.email}
          </Text>
          <View
            className={`mt-3 flex-row items-center rounded-full px-3 py-1 ${
              studentData.isVerified
                ? "bg-emerald-100 dark:bg-emerald-900/40"
                : "bg-amber-100 dark:bg-amber-900/40"
            }`}
          >
            <Ionicons
              name={
                studentData.isVerified ? "checkmark-circle" : "time-outline"
              }
              size={16}
              color={studentData.isVerified ? "#059669" : "#d97706"}
            />
            <Text
              className={`ml-1 text-xs font-bold ${
                studentData.isVerified
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-amber-700 dark:text-amber-300"
              }`}
            >
              {studentData.isVerified
                ? "Verified student"
                : "Pending verification"}
            </Text>
          </View>
        </View>

        <Text className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Personal information
        </Text>
        <ProfileField
          label="Full name"
          value={studentData.fullName}
          onChangeText={(fullName) =>
            setStudentData((current) => ({ ...current, fullName }))
          }
          autoCapitalize="words"
        />
        <ProfileField
          label="Email"
          value={studentData.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={false}
        />
        <ProfileField
          label="Phone number"
          value={studentData.phoneNumber}
          onChangeText={(phoneNumber) =>
            setStudentData((current) => ({ ...current, phoneNumber }))
          }
          keyboardType="phone-pad"
        />

        <Text className="mb-4 mt-2 text-lg font-bold text-slate-900 dark:text-white">
          University information
        </Text>
        <ProfileField
          label="University"
          value={`${studentData.universityShortName} - ${studentData.universityFullName}`}
          editable={false}
        />
        <ProfileField
          label="Branch"
          value={studentData.universityBranch}
          editable={false}
        />
        <ProfileField
          label="Student ID"
          value={studentData.universityStudentId}
          editable={false}
        />

        <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          University card
        </Text>
        {studentData.universityCardImageUrl ? (
          <Image
            source={{ uri: studentData.universityCardImageUrl }}
            className="h-48 w-full rounded-2xl border border-slate-200 bg-slate-200 dark:border-zinc-700 dark:bg-zinc-800"
            resizeMode="cover"
          />
        ) : null}

        <View className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            Member since
          </Text>
          <Text className="mt-1 font-semibold text-slate-900 dark:text-white">
            {memberSince}
          </Text>
        </View>

        <Pressable
          className="mt-6 h-14 items-center justify-center rounded-xl bg-blue-600"
          disabled={isLoading}
          onPress={handleSave}
        >
          <Text className="text-base font-bold text-white">Save changes</Text>
        </Pressable>
      </ScrollView>

      {isLoading ? (
        <View className="absolute inset-0 items-center justify-center bg-slate-950/20">
          <View className="h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-zinc-900">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        </View>
      ) : null}
    </View>
  );
}
