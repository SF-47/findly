import React from "react";
import {
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

export default function RegisterScreen({navigation}) {
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
          paddingTop: 60,
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

            <Text className="text-3xl font-bold text-slate-900">
              Create Account
            </Text>

            <Text className="mt-3 text-base leading-6 text-slate-500">
              Register to report lost items and track found items.
            </Text>
          </View>

          {/* Full Name */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-slate-700">
              Full Name
            </Text>

            <TextInput
              className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900"
              placeholder="Enter your full name"
              placeholderTextColor="#94a3b8"
              autoCapitalize="words"
            />
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

          {/* Phone Number */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-slate-700">
              Phone Number
            </Text>

            <TextInput
              className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900"
              placeholder="Enter your phone number"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
            />
          </View>

          {/* University ID */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-slate-700">
              University ID
            </Text>

            <TextInput
              className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900"
              placeholder="Enter your university ID"
              placeholderTextColor="#94a3b8"
              autoCapitalize="characters"
            />
          </View>

          {/* Password */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-slate-700">
              Password
            </Text>

            <TextInput
              className="h-14 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900"
              placeholder="Create a password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Register Button */}
          <Pressable className="mt-2 h-14 items-center justify-center rounded-xl bg-blue-600">
            <Text className="text-base font-bold text-white">
              Register
            </Text>
          </Pressable>

          {/* Login Link */}
          <View className="mt-8 flex-row justify-center">
            <Text className="text-slate-500">
              Already have an account?
            </Text>

            <Pressable onPress={()=> navigation.navigate("Login")}>
              <Text className="font-bold text-blue-600">
                {" "}Login
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}