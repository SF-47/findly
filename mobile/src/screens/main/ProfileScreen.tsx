import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useState, useEffect } from "react";
import {
  getCurrentStudent,
  updateCurrentStudent,
} from "../../services/studentService";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileScreenProps } from "../../navigation/types";

interface ProfileFieldProps extends TextInputProps {
  label: string;
  value: string;
}

function ProfileField({ label, value, ...inputProps }: ProfileFieldProps) {
  const isEditable = inputProps.editable !== false;
  return (
    <View className="mb-5">
      <View className="flex-row items-center mb-2">
        <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </Text>
        <Ionicons 
          name={isEditable ? "create-outline" : "lock-closed-outline"} 
          size={13} 
          color={isEditable ? "#2563eb" : "#94a3b8"} 
          style={{ marginLeft: 6 }} 
        />
        {isEditable && (
          <Text className="ml-1 text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
            (Editable)
          </Text>
        )}
      </View>
      <TextInput
        className={`h-14 rounded-xl px-4 text-base border border-slate-200 dark:border-zinc-800 ${
          isEditable 
            ? "text-slate-900 dark:text-white bg-white dark:bg-zinc-900" 
            : "text-slate-400 dark:text-slate-500 bg-slate-100/40 dark:bg-zinc-900/30"
        }`}
        value={value ?? ""}
        placeholderTextColor="#94a3b8"
        {...inputProps}
      />
    </View>
  );
}

interface StudentData {
  fullName: string;
  email: string;
  universityId: string;
  universityStudentId: string;
  universityShortName: string;
  universityFullName: string;
  universityBranch: string;
  phoneNumber: string;
  isVerified: boolean | null;
  universityCardImageUrl: string;
  createdAt: string;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  // insets removed
  const [studentData, setStudentData] = useState<StudentData>({
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchStudentData() {
    try {
      setIsLoading(true);

      const student = await getCurrentStudent() as any;

      setStudentData({
        fullName: student.fullName || "",
        email: student.email || "",
        universityId: student.universityId || "",
        universityStudentId: student.universityStudentId || "",
        universityShortName: student.universityShortName || student.university?.shortName || "",
        universityFullName: student.universityFullName || student.university?.fullName || "",
        universityBranch: student.universityBranch || student.university?.branch || "",
        phoneNumber: student.phoneNumber || "",
        isVerified: student.isVerified ?? null,
        universityCardImageUrl: student.universityCardImageUrl || "",
        createdAt: student.createdAt || "",
      });
    } catch (error: any) {
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

  const memberSince = studentData.createdAt
    ? new Date(studentData.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

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

      setStudentData((current) => ({
        ...current,
        fullName: updatedStudent.fullName || current.fullName,
        phoneNumber: updatedStudent.phoneNumber || current.phoneNumber,
      }));
      Alert.alert("Profile updated", "Your changes were saved successfully.");
    } catch (error: any) {
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
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-zinc-950" edges={["top", "bottom"]}>
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
          <View>
            <Text className="text-3xl font-bold text-slate-900 dark:text-white">
              Profile
            </Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View and update your personal information.
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
        pointerEvents={isLoading ? "none" : "auto"}
        showsVerticalScrollIndicator={false}
        style={{ opacity: isLoading ? 0.35 : 1 }}
      >
        <View className="mb-6 items-center rounded-3xl bg-white p-6 dark:bg-zinc-900">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-blue-600">
            <Text className="text-3xl font-black uppercase text-white">
              {studentData.fullName ? studentData.fullName.charAt(0) : "?"}
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
          value={
            studentData.universityShortName && studentData.universityFullName
              ? `${studentData.universityShortName} - ${studentData.universityFullName}`
              : studentData.universityShortName || studentData.universityFullName || ""
          }
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
            className="h-48 w-full rounded-2xl bg-slate-200 dark:bg-zinc-800"
            resizeMode="cover"
          />
        ) : null}

        <View className="mt-6 rounded-2xl bg-white p-4 dark:bg-zinc-900">
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
    </SafeAreaView>
  );
}
