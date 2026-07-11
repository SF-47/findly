import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { uploadUniversityCardImage } from "../../api/supabaseStorage";
import { registerStudent } from "../../services/authService";
import { getAllUniversities } from "../../services/universitiesService";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterScreenProps } from "../../navigation/types";
import { University } from "../../types";

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  universityId: string;
  universityStudentId: string;
  universityCardImageUrl: string;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    universityId: "",
    universityStudentId: "",
    universityCardImageUrl: "",
  });
  const [universities, setUniversities] = useState<University[]>([]);
  const [cardImageAsset, setCardImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [showUniversities, setShowUniversities] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { colorScheme } = useColorScheme();

  function updateRegisterForm(name: keyof RegisterForm, value: string): void {
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  }

  function getRegistrationErrorMessage(error: any): string {
    const responseData = error?.response?.data;
    const validationErrors = responseData?.errors;

    if (validationErrors && typeof validationErrors === "object") {
      const firstError = Object.values(validationErrors)[0];

      if (Array.isArray(firstError)) {
        return (firstError[0] as string) || responseData?.message;
      }

      return (firstError as string) || responseData?.message;
    }

    return (
      responseData?.message ||
      error?.message ||
      "Registration failed. Please try again."
    );
  }

  function validateRegisterForm(): string {
    if (
      !registerForm.fullName.trim() ||
      !registerForm.email.trim() ||
      !registerForm.password.trim() ||
      !registerForm.phoneNumber.trim() ||
      !registerForm.universityId.trim() ||
      !registerForm.universityStudentId.trim() ||
      !registerForm.universityCardImageUrl.trim() ||
      !cardImageAsset
    ) {
      return "Please fill in all fields and add your university card.";
    }

    if (registerForm.fullName.trim().length < 3) {
      return "Full name must be at least 3 characters.";
    }

    if (
      !registerForm.email.trim().includes("@") ||
      !registerForm.email.trim().includes(".")
    ) {
      return "Email format is invalid.";
    }

    if (registerForm.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (
      !/^(03|70|71|76|78|79|81)\d{6}$/.test(registerForm.phoneNumber.trim())
    ) {
      return "Phone number must be a valid Lebanese mobile number.";
    }

    return "";
  }

  async function handlePickUniversityCard(): Promise<void> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo access to upload your university card.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];

      setCardImageAsset(selectedAsset);
      updateRegisterForm("universityCardImageUrl", selectedAsset.uri);
    }
  }

  async function handleRegister(): Promise<void> {
    try {
      setError("");
      setIsLoading(true);

      const validationError = validateRegisterForm();

      if (validationError) {
        setError(validationError);
        return;
      }

      if (!cardImageAsset) {
        setError("Please add your university card image.");
        return;
      }

      const universityCardImageUrl =
        await uploadUniversityCardImage(cardImageAsset);

      await registerStudent({
        fullName: registerForm.fullName.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
        phoneNumber: registerForm.phoneNumber.trim(),
        universityId: registerForm.universityId.trim(),
        universityStudentId: registerForm.universityStudentId.trim(),
        universityCardImageUrl,
      });

      navigation.replace("PendingVerification");
    } catch (error: any) {
      console.log(error);

      setError(getRegistrationErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUniversities();
  }, []);

  async function loadUniversities(): Promise<void> {
    try {
      const data = await getAllUniversities();
      setUniversities(data);
    } catch (error: any) {
      console.log(error);
      setError("Failed to load universities.");
    }
  }

  const selectedUniversity = universities.find(
    (university) => university.id === registerForm.universityId,
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
      >
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={colorScheme === "dark" ? "#09090b" : "#ffffff"}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 40,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center">
            {/* Header */}
            <View className="mb-8">
              <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
                <Ionicons name="person-add-outline" size={32} color="white" />
              </View>

              <Text className="text-3xl font-bold text-slate-900 dark:text-white">
                Create Account
              </Text>

              <Text className="mt-3 text-base leading-6 text-slate-500 dark:text-zinc-400">
                Register to report lost items and track found items.
              </Text>
            </View>

            {/* Full Name */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                Full Name
              </Text>

              <TextInput
                className="h-14 rounded-xl bg-slate-100 dark:bg-zinc-900 px-4 text-base text-slate-900 dark:text-white"
                placeholder="Enter your full name"
                placeholderTextColor={colorScheme === "dark" ? "#52525b" : "#94a3b8"}
                autoCapitalize="words"
                value={registerForm.fullName}
                onChangeText={(text: string) => updateRegisterForm("fullName", text)}
              />
            </View>

            {/* Email */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                Email
              </Text>

              <TextInput
                className="h-14 rounded-xl bg-slate-100 dark:bg-zinc-900 px-4 text-base text-slate-900 dark:text-white"
                placeholder="Enter your email"
                placeholderTextColor={colorScheme === "dark" ? "#52525b" : "#94a3b8"}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={registerForm.email}
                onChangeText={(text: string) => updateRegisterForm("email", text)}
              />
            </View>

            {/* Phone Number */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                Phone Number
              </Text>

              <TextInput
                className="h-14 rounded-xl bg-slate-100 dark:bg-zinc-900 px-4 text-base text-slate-900 dark:text-white"
                placeholder="Enter your phone number"
                placeholderTextColor={colorScheme === "dark" ? "#52525b" : "#94a3b8"}
                keyboardType="phone-pad"
                value={registerForm.phoneNumber}
                onChangeText={(text: string) => updateRegisterForm("phoneNumber", text)}
              />
            </View>

            {/* University */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                University
              </Text>

              <Pressable
                className="h-14 flex-row items-center justify-between rounded-xl bg-slate-100 dark:bg-zinc-900 px-4"
                onPress={() => setShowUniversities((prev) => !prev)}
              >
                <Text
                  className={
                    selectedUniversity
                      ? "text-base text-slate-900 dark:text-white"
                      : "text-base text-slate-400 dark:text-zinc-500"
                  }
                >
                  {selectedUniversity
                    ? `${selectedUniversity.shortName} - ${selectedUniversity.branch}`
                    : "Choose your university"}
                </Text>

                <Ionicons
                  name={
                    showUniversities
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={20}
                  color="#64748b"
                />
              </Pressable>

              {showUniversities ? (
                <View className="mt-2 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-900">
                  {universities.length === 0 ? (
                    <Text className="px-4 py-3 text-slate-500 dark:text-zinc-400">
                      No universities found.
                    </Text>
                  ) : (
                    universities.map((university) => (
                      <Pressable
                        key={university.id}
                        className="border-b border-slate-200 dark:border-zinc-800 px-4 py-3"
                        onPress={() => {
                          updateRegisterForm("universityId", university.id);
                          setShowUniversities(false);
                        }}
                      >
                        <Text className="font-bold text-slate-900 dark:text-white">
                          {university.shortName} - {university.branch}
                        </Text>

                        <Text className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                          {university.fullName}
                        </Text>
                      </Pressable>
                    ))
                  )}
                </View>
              ) : null}
            </View>

            {/* Student ID */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                Student ID
              </Text>

              <TextInput
                className="h-14 rounded-xl bg-slate-100 dark:bg-zinc-900 px-4 text-base text-slate-900 dark:text-white"
                placeholder="Enter your university student ID"
                placeholderTextColor={colorScheme === "dark" ? "#52525b" : "#94a3b8"}
                autoCapitalize="characters"
                value={registerForm.universityStudentId}
                onChangeText={(text: string) =>
                  updateRegisterForm("universityStudentId", text)
                }
              />
            </View>

            {/* Password */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                Password
              </Text>

              <TextInput
                className="h-14 rounded-xl bg-slate-100 dark:bg-zinc-900 px-4 text-base text-slate-900 dark:text-white"
                placeholder="Create a password"
                placeholderTextColor={colorScheme === "dark" ? "#52525b" : "#94a3b8"}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                value={registerForm.password}
                onChangeText={(text: string) => updateRegisterForm("password", text)}
              />
            </View>

            {/* University Card */}
            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                University Card
              </Text>

              {registerForm.universityCardImageUrl ? (
                <Image
                  source={{ uri: registerForm.universityCardImageUrl }}
                  className="mb-3 h-40 w-full rounded-xl"
                  resizeMode="cover"
                />
              ) : null}

              <Pressable
                className="h-14 flex-row items-center justify-center rounded-xl bg-blue-50 dark:bg-zinc-900 dark:border dark:border-zinc-800"
                onPress={handlePickUniversityCard}
              >
                <Ionicons
                  name="image-outline"
                  size={22}
                  color={colorScheme === "dark" ? "#60a5fa" : "#2563eb"}
                  style={{ marginRight: 8 }}
                />
                <Text className="text-base font-bold text-blue-600 dark:text-blue-400">
                  {registerForm.universityCardImageUrl
                    ? "Change card image"
                    : "Add card image"}
                </Text>
              </Pressable>
            </View>

            {error ? (
              <Text className="mb-3 text-center text-sm font-semibold text-red-500">
                {error}
              </Text>
            ) : null}

            {/* Register Button */}
            <Pressable
              className={`mt-2 h-14 items-center justify-center rounded-xl ${
                isLoading ? "bg-blue-400" : "bg-blue-600"
              }`}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text className="text-base font-bold text-white">
                {isLoading ? "Registering..." : "Register"}
              </Text>
            </Pressable>

            {/* Login Link */}
            <View className="mt-8 flex-row justify-center">
              <Text className="text-slate-500 dark:text-zinc-400">Already have an account?</Text>

              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text className="font-bold text-blue-600"> Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
