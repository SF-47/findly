import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MatchDetailsScreenProps } from "../../navigation/types";
import { FoundItem, LostItem } from "../../types";

export default function MatchDetailsScreen({ route, navigation }: MatchDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const match = route.params?.match;
  const currentStudentName = route.params?.currentStudentName;

  if (!match) {
    return (
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          No match selected
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

  function renderItemDetails(item: FoundItem | LostItem, isLost: boolean) {
    const isYours = item.studentName === currentStudentName;
    const typeLabel = isLost ? "Lost Item" : "Found Item";
    const typeColor = isLost
      ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    
    const rawDate = isLost 
      ? (item as LostItem).lostDate 
      : (item as FoundItem).foundDate;
      
    const dateText = new Date(
      item.date || rawDate || new Date(),
    ).toLocaleDateString();

    return (
      <View className="mb-5 rounded-3xl bg-white p-5 dark:bg-zinc-900">
        <View className="mb-4 flex-row items-center justify-between">
          <Text
            className={`rounded-full px-3 py-1 text-xs font-bold ${typeColor}`}
          >
            {typeLabel}
          </Text>
          {isYours && (
            <View
              className={`rounded px-2 py-0.5 ${isLost ? "bg-rose-200 dark:bg-rose-900/40" : "bg-emerald-200 dark:bg-emerald-900/40"}`}
            >
              <Text
                className={`text-[10px] font-bold ${isLost ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300"}`}
              >
                Yours
              </Text>
            </View>
          )}
        </View>

        {item.imageUrl ? (
          <Image
            className="mb-5 h-48 w-full rounded-2xl bg-slate-100 dark:bg-zinc-800"
            resizeMode="cover"
            source={{ uri: item.imageUrl }}
          />
        ) : (
          <View className="mb-5 h-48 w-full items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-800/50">
            <Ionicons name="image-outline" size={48} color="#94a3b8" />
            <Text className="mt-2 text-sm text-slate-400">
              No image provided
            </Text>
          </View>
        )}

        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {item.itemName}
        </Text>
        <Text className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
          Reported by: {item.studentName}
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {item.categoryName && (
            <View className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-zinc-800 mr-2 mb-2">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {item.categoryName}
              </Text>
            </View>
          )}
          {item.location && (
            <View className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-zinc-800 mr-2 mb-2">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {item.location}
              </Text>
            </View>
          )}
          {dateText && dateText !== "Invalid Date" && (
            <View className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-zinc-800 mr-2 mb-2">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {dateText}
              </Text>
            </View>
          )}
          {item.color && (
            <View className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-zinc-800 mr-2 mb-2">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Color: {item.color}
              </Text>
            </View>
          )}
        </View>

        <View className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-800/50">
          <Text className="text-sm font-bold text-gray-900 dark:text-white">
            Description
          </Text>
          <Text className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {item.description || "No description added for this item."}
          </Text>
        </View>
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

          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Match Details
          </Text>

          <View className="h-11 w-11" />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 flex-row items-center justify-center rounded-3xl bg-blue-600 p-5 dark:bg-blue-500">
          <View className="flex-1 items-center">
            <Text className="text-white/80 text-xs font-bold uppercase tracking-wider">
              AI Confidence
            </Text>
            <Text className="mt-1 text-3xl font-black text-white">
              {match.matchPercentage}%
            </Text>
          </View>
          <View className="h-10 w-px bg-white/20 mx-4" />
          <View className="flex-1 items-center">
            <Text className="text-white/80 text-xs font-bold uppercase tracking-wider">
              Status
            </Text>
            <Text className="mt-1 text-lg font-bold text-white">
              {match.status || "Pending"}
            </Text>
          </View>
        </View>

        {renderItemDetails(match.lostItem, true)}

        <View className="mb-5 items-center justify-center">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
            <Ionicons name="swap-vertical" size={20} color="#3b82f6" />
          </View>
        </View>

        {renderItemDetails(match.foundItem, false)}

        <Pressable
          className="mt-5 mb-8 flex-row items-center justify-center rounded-2xl bg-blue-600 py-4 dark:bg-blue-500"
          onPress={() =>
            navigation.navigate("Chat", {
              matchId: match.id,
              otherStudentName:
                match.lostItem.studentName === currentStudentName
                  ? match.foundItem.studentName!
                  : match.lostItem.studentName!,
              receiverId:
                match.lostItem.studentName === currentStudentName
                  ? match.foundItem.studentId
                  : match.lostItem.studentId,
            })
          }
        >
          <Ionicons name="chatbubbles" size={24} color="white" />
          <Text className="ml-2 text-lg font-bold text-white">
            Chat with Student
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
