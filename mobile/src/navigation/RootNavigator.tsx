import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import MainNavigator from "./MainNavigator";
import PendingVerificationScreen from "../screens/auth/PendingVerificationScreen";
import { getToken, removeToken } from "../storage/tokenStorage";
import { getCurrentStudent } from "../services/studentService";
import { navigationRef } from "./navigationRef";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { colorScheme } = useColorScheme();
  const [initialRouteName, setInitialRouteName] = useState<keyof RootStackParamList | null>(null);
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark ? "#09090b" : "#f8fafc";
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: backgroundColor,
      card: backgroundColor,
    },
  };

  useEffect(() => {
    async function loadInitialRoute() {
      try {
        const token = await getToken();

        if (!token) {
          setInitialRouteName("Login");
          return;
        }

        const student = await getCurrentStudent();
        setInitialRouteName(
          student?.isVerified ? "Main" : "PendingVerification",
        );
      } catch (error: any) {
        if (error?.response?.status === 401) {
          await removeToken();
          setInitialRouteName("Login");
          return;
        }

        setInitialRouteName("Main");
      }
    }

    loadInitialRoute();
  }, []);

  if (!initialRouteName) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor }}
      >
        <ActivityIndicator
          size="large"
          color={isDark ? "#60a5fa" : "#2563eb"}
        />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme} ref={navigationRef}>
      <Stack.Navigator
        id="root"
        initialRouteName={initialRouteName || undefined}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor,
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="PendingVerification"
          component={PendingVerificationScreen}
        />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
