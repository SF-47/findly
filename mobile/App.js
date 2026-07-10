import "./global.css";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import * as SecureStore from "expo-secure-store";
import RootNavigator from "./src/navigation/RootNavigator";

function AppContent() {
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await SecureStore.getItemAsync("user_theme");
        if (savedTheme === "dark" || savedTheme === "light") {
          setColorScheme(savedTheme);
        }
      } catch (e) {
        console.log("Failed to load theme preference", e);
      }
    }
    loadTheme();
  }, [setColorScheme]);

  return <RootNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
