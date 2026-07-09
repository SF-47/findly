import { Text, View } from "react-native";
function ScreenHeader({ title, subtitle }) {
  return (
    <View >
      <Text className="text-3xl font-bold text-slate-900 dark:text-white">{title}</Text>
      <Text className="mt-2 text-base leading-6 text-slate-500 dark:text-gray-400">
        {subtitle}
      </Text>
    </View>
  );
}

export default ScreenHeader;
