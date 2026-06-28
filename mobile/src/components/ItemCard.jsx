import { Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function ItemCard({ item }) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4 dark:bg-zinc-900">
      <View className="flex-row items-start">
        <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/40">
          {item.imageUrl ? (
            <Image
              className="h-14 w-14 rounded-2xl"
              resizeMode="cover"
              source={{ uri: item.imageUrl }}
            />
          ) : (
            <Ionicons name={item.icon} size={25} color="#3b82f6" />
          )}
        </View>
        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">
              {item.title}
            </Text>
            <Text
              className={`rounded-full px-3 py-1 text-xs font-bold ${item.color}`}
            >
              {item.type}
            </Text>
          </View>
          <Text className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            {item.meta}
          </Text>
          <Text className="mt-3 text-sm leading-5 text-slate-600 dark:text-gray-300">
            Tap to view details, contact information, and claim options.
          </Text>
        </View>
      </View>
    </View>
  );
}

export default ItemCard;
