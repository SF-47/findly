import { Pressable, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

export default function ThemeButton() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable
      accessibilityLabel="Toggle theme"
      accessibilityRole="button"
      className={`relative h-9 w-16 rounded-full border shadow-lg ${
        isDark ? "border-zinc-600 bg-zinc-800" : "border-gray-300 bg-gray-200"
      }`}
      hitSlop={10}
      onPress={toggleColorScheme}
    >
      <View
        className={`absolute top-1 h-7 w-7 items-center justify-center rounded-full shadow-md ${
          isDark ? "left-8 bg-zinc-700" : "left-1 bg-white"
        }`}
      >
        <Text
          className={`text-sm font-bold ${
            isDark ? "text-yellow-300" : "text-orange-500"
          }`}
        >
          {isDark ? "☾" : "☀"}
        </Text>
      </View>
    </Pressable>
  );
}
