import { Ionicons } from "@expo/vector-icons";
import { Alert, Image, Pressable, ScrollView, Text, View, Platform } from "react-native";
import { deleteMyFoundItem, deleteMyLostItem } from "../../services/itemService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ItemDetailsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const item = route.params?.item;
  const isMyReport = route.params?.isMyReport;

  async function handleDelete() {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to delete this report? This cannot be undone.");
      if (confirmed) {
        try {
          if (item.type === "Lost") {
            await deleteMyLostItem(item.id);
          } else {
            await deleteMyFoundItem(item.id);
          }
          window.alert("Report deleted successfully.");
          navigation.goBack();
        } catch (error) {
          window.alert("Could not delete the report. Please try again.");
        }
      }
      return;
    }

    Alert.alert(
      "Delete report",
      "Are you sure you want to delete this report? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (item.type === "Lost") {
                await deleteMyLostItem(item.id);
              } else {
                await deleteMyFoundItem(item.id);
              }
              Alert.alert("Success", "Report deleted successfully.");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Could not delete the report. Please try again.");
            }
          },
        },
      ]
    );
  }

  function handleEdit() {
    navigation.navigate("EditReport", { editItem: item });
  }

  if (!item) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5 dark:bg-zinc-950">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          No item selected
        </Text>
        <Pressable
          className="mt-4 rounded-xl bg-blue-600 px-5 py-3 dark:bg-blue-500"
          onPress={() => navigation.goBack()}
        >
          <Text className="font-bold text-white">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-zinc-950">
      <View
        className="px-5 pb-4 bg-slate-50 dark:bg-zinc-950"
        style={{ paddingTop: Math.max(insets.top, 24) + 12, zIndex: 10 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-zinc-900"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#64748b" />
          </Pressable>

          <Text className="text-base font-bold text-gray-900 dark:text-white">
            Item details
          </Text>

          <Pressable 
            className="h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-zinc-900"
            onPress={isMyReport ? handleEdit : undefined}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color={isMyReport ? "#2563eb" : "#64748b"} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >

      <View className="rounded-3xl bg-white p-5 dark:bg-zinc-900">
        {item.imageUrl ? (
          <Image
            className="mb-5 h-56 w-full rounded-3xl bg-slate-100 dark:bg-zinc-800"
            resizeMode="cover"
            source={{ uri: item.imageUrl }}
          />
        ) : (
          <View className="mb-5 h-28 w-28 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-900/40">
            <Ionicons name={item.icon} size={48} color="#3b82f6" />
          </View>
        )}

        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              {item.title}
            </Text>
            <Text className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {item.meta}
            </Text>
          </View>

          <Text
            className={`rounded-full px-3 py-1 text-xs font-bold ${item.color}`}
          >
            {item.type}
          </Text>
        </View>

        <View className="mt-6 rounded-2xl bg-gray-50 p-4 dark:bg-zinc-800">
          <Text className="text-sm font-bold text-gray-900 dark:text-white">
            Description
          </Text>
          <Text className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {item.description || "No description added for this item."}
          </Text>
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-white p-5 dark:bg-zinc-900">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          {isMyReport ? "Manage report" : "Quick actions"}
        </Text>

        {isMyReport ? (
          <>
            <Pressable 
              className="mt-4 h-14 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500"
              onPress={handleEdit}
            >
              <Text className="font-bold text-white">Edit report</Text>
            </Pressable>

            <Pressable 
              className="mt-3 h-14 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50"
              onPress={handleDelete}
            >
              <Text className="font-bold text-rose-600 dark:text-rose-400">
                Delete report
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable className="mt-4 h-14 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500">
              <Text className="font-bold text-white">
                {item.type === "Found" ? "Claim this item" : "I found a match"}
              </Text>
            </Pressable>

            <Pressable className="mt-3 h-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800">
              <Text className="font-bold text-gray-800 dark:text-white">
                Contact support
              </Text>
            </Pressable>
          </>
        )}
      </View>
      </ScrollView>
    </View>
  );
}
