import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PendingVerificationScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-slate-50"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
          <Text className="text-3xl">⏳</Text>
        </View>

        <Text className="mb-3 text-center text-2xl font-extrabold text-slate-900">
          Waiting for Verification
        </Text>

        <Text className="text-center text-base leading-6 text-slate-500">
          Your account was created successfully. Please wait until your
          university admin verifies your student card.
        </Text>
      </View>
    </View>
  );
}
