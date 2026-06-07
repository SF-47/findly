import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 70,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center">
          {/* Logo */}
          <View className="mb-10">
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <Ionicons name="search-outline" size={34} color="white" />
            </View>

            <Text className="text-3xl font-bold text-slate-900">
              Welcome Back
            </Text>

            <Text className="mt-3 text-base leading-6 text-slate-500">
              Login to continue using Smart Lost & Found.
            </Text>
          </View>

          {/* Email */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-slate-700">
              Email
            </Text>

            <TextInput
              className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900"
              placeholder="Enter your email"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View className="mb-3">
            <Text className="mb-2 text-sm font-semibold text-slate-700">
              Password
            </Text>

            <TextInput
              className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900"
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Forgot password */}
          <Pressable className="mb-6 self-end">
            <Text className="font-semibold text-blue-600">
              Forgot Password?
            </Text>
          </Pressable>

          {/* Login button */}
          <Pressable
            className="h-14 items-center justify-center rounded-xl bg-blue-600"
            onPress={() => navigation.replace("Main")}
          >
            <Text className="text-base font-bold text-white">Login</Text>
          </Pressable>

          {/* Register */}
          <View className="mt-8 flex-row justify-center">
            <Text className="text-slate-500">Don&apos;t have an account?</Text>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="font-bold text-blue-600"> Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
