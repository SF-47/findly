import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "student_token";

export async function saveToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error("Error saving token to localStorage", e);
    }
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.error("Error getting token from localStorage", e);
      return null;
    }
  }
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (e) {
    console.error("Error getting token from SecureStore", e);
    return null;
  }
}

export async function removeToken(): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error("Error removing token from localStorage", e);
    }
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
