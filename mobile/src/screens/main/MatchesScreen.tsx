import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../../components/ScreenHeader";
import { getMyMatches } from "../../services/matchService";
import { getCurrentStudent } from "../../services/studentService";
import { MatchesScreenProps } from "../../navigation/types";
import { ItemsMatch } from "../../types";

type FilterType = "All" | "Lost" | "Found";

interface FilterOption {
  key: FilterType;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}

const FILTER_TYPES: FilterOption[] = [
  {
    key: "All",
    title: "All",
    icon: "apps-outline",
    color: "#2563eb",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    key: "Lost",
    title: "My Lost",
    icon: "alert-circle-outline",
    color: "#e11d48",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    key: "Found",
    title: "My Found",
    icon: "checkmark-circle-outline",
    color: "#059669",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
];

interface TypeFilterOptionProps {
  type: FilterOption;
  isSelected: boolean;
  onPress: () => void;
}

function TypeFilterOption({ type, isSelected, onPress }: TypeFilterOptionProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`h-12 flex-1 flex-row items-center justify-center rounded-2xl ${
        isSelected ? type.bg : "bg-transparent"
      }`}
      onPress={onPress}
    >
      <View
        className={`mr-2 h-8 w-8 items-center justify-center rounded-xl ${
          isSelected ? type.bg : "bg-white dark:bg-zinc-800"
        }`}
      >
        <Ionicons name={type.icon} size={18} color={type.color} />
      </View>

      <Text
        className={`text-sm font-black ${
          isSelected
            ? "text-slate-900 dark:text-white"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {type.title}
      </Text>
    </TouchableOpacity>
  );
}

interface EmptyStateProps {
  isLoading: boolean;
  navigation: MatchesScreenProps["navigation"];
}

function EmptyState({ isLoading }: EmptyStateProps) {
  if (isLoading) return null;
  return (
    <View className="mt-20 items-center justify-center px-6">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
        <Ionicons name="search-outline" size={40} color="#3b82f6" />
      </View>
      <Text className="text-center text-xl font-bold text-slate-900 dark:text-white">
        No matches yet
      </Text>
      <Text className="mt-2 text-center text-base text-slate-500 dark:text-zinc-400">
        When our AI finds a potential match for the items you've reported, it
        will appear here.
      </Text>
    </View>
  );
}

export default function MatchesScreen({ navigation }: MatchesScreenProps) {
  const [myMatches, setMyMatches] = useState<ItemsMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [currentStudentName, setCurrentStudentName] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("All");

  async function fetchMyMatches() {
    try {
      const student = await getCurrentStudent();
      setCurrentStudentName(student.fullName);

      const matches = await getMyMatches();
      setMyMatches(matches || []);
    } catch (error) {
      console.error("Failed to fetch matches", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onRefresh() {
    setIsRefreshing(true);
    await fetchMyMatches();
    setIsRefreshing(false);
  }

  const filteredMatches = myMatches.filter((match) => {
    if (filter === "All") return true;
    if (filter === "Lost") return match.lostItem.studentName === currentStudentName;
    if (filter === "Found") return match.foundItem.studentName === currentStudentName;
    return true;
  });

  useEffect(() => {
    fetchMyMatches();
  }, []);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-zinc-950">
      <View className="flex-row items-start justify-between pb-2">
        <View className="flex-1 pr-4">
          <ScreenHeader
            title="My Matches"
            subtitle="Matches found specifically for the items you've reported."
          />
        </View>
      </View>
      {isLoading && !isRefreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          className="flex-1"
          data={filteredMatches}
          keyExtractor={(match) => match.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#3b82f6"
              colors={["#3b82f6"]}
            />
          }
          ListHeaderComponent={
            <View className="mb-4">
              <View className="mt-2 w-full flex-row">
                <TouchableOpacity
                  className="mr-3 flex-1 flex-row items-center justify-center rounded-xl bg-blue-600 py-3 dark:bg-blue-500"
                  onPress={() => navigation.navigate("Report")}
                >
                  <Ionicons name="add-circle-outline" size={20} color="white" />
                  <Text className="ml-2 font-bold text-white">Report Item</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center rounded-xl bg-blue-600 py-3 dark:bg-blue-500"
                  onPress={() => navigation.navigate("MyReports")}
                >
                  <Ionicons name="folder-open-outline" size={20} color="white" />
                  <Text className="ml-2 font-bold text-white">My Reports</Text>
                </TouchableOpacity>
              </View>

              <View className="mb-2 mt-5 flex-row rounded-3xl bg-slate-100 p-1 dark:bg-zinc-900">
                {FILTER_TYPES.map((type) => (
                  <TypeFilterOption
                    key={type.key}
                    type={type}
                    isSelected={filter === type.key}
                    onPress={() => setFilter(type.key)}
                  />
                ))}
              </View>
            </View>
          }
          ListEmptyComponent={<EmptyState isLoading={isLoading} navigation={navigation} />}
          renderItem={({ item: match }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              className="mb-4 mt-2 rounded-2xl bg-white p-5 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none dark:bg-zinc-900"
              onPress={() => navigation.navigate("MatchDetails", { match, currentStudentName })}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/40">
                    <Ionicons name="sparkles" size={18} color="#3b82f6" />
                  </View>
                  <Text className="text-lg font-bold text-slate-900 dark:text-white">
                    Match for your item
                  </Text>
                </View>
                <Text className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                  {match.matchPercentage}%
                </Text>
              </View>

              <View className="mt-5 flex-row">
                <View className="mr-3 flex-1 rounded-xl bg-red-50 p-4 dark:bg-zinc-800">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-bold uppercase tracking-wider text-red-500">
                      Lost Item
                    </Text>
                    {match.lostItem.studentName === currentStudentName && (
                      <View className="rounded bg-red-200 px-2 py-0.5 dark:bg-red-900/40">
                        <Text className="text-[10px] font-bold text-red-700 dark:text-red-300">
                          Yours
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    className="mt-2 text-base font-bold text-slate-900 dark:text-white"
                    numberOfLines={1}
                  >
                    {match.lostItem.itemName}
                  </Text>
                  <Text
                    className="mt-1 text-xs text-slate-500 dark:text-zinc-400"
                    numberOfLines={1}
                  >
                    {match.lostItem.studentName}
                  </Text>
                </View>

                <View className="flex-1 rounded-xl bg-emerald-50 p-4 dark:bg-zinc-800">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Found Item
                    </Text>
                    {match.foundItem.studentName === currentStudentName && (
                      <View className="rounded bg-emerald-200 px-2 py-0.5 dark:bg-emerald-900/40">
                        <Text className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          Yours
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    className="mt-2 text-base font-bold text-slate-900 dark:text-white"
                    numberOfLines={1}
                  >
                    {match.foundItem.itemName}
                  </Text>
                  <Text
                    className="mt-1 text-xs text-slate-500 dark:text-zinc-400"
                    numberOfLines={1}
                  >
                    {match.foundItem.studentName}
                  </Text>
                </View>
              </View>
              
              <View className="mt-4 flex-row items-center justify-center border-t border-slate-200 pt-4 dark:border-zinc-800">
                <Text className="font-bold text-blue-600 dark:text-blue-500">View Match Details</Text>
                <Ionicons name="chevron-forward" size={16} color="#3b82f6" style={{ marginLeft: 4 }} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
