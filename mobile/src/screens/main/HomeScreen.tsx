import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { HomeScreenProps } from "../../navigation/types";
import { getCurrentStudent } from "../../services/studentService";
import { getStudentFoundItemsByUniversity, getStudentLostItemsByUniversity, getMyFoundItems, getMyLostItems } from "../../services/itemService";
import ItemCard from "../../components/ItemCard";
import { CardItem, MainStackParamList } from "../../types";

function formatDate(value: string | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

interface HomeItem {
  id: string;
  studentId: string;
  categoryId: number;
  itemName: string;
  description: string;
  color: string;
  location: string;
  lostDate?: string;
  foundDate?: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
  itemType: "Lost" | "Found";
  categoryName?: string;
  studentName?: string;
}

function mapItemForCard(item: HomeItem): CardItem {
  const isLost = item.itemType === "Lost";
  const dateText = formatDate(isLost ? item.lostDate : item.foundDate);
  const metaParts = [item.categoryName, item.location, dateText].filter(Boolean);

  return {
    ...item,
    title: item.itemName || "Untitled item",
    icon: (isLost ? "search-outline" : "checkmark-circle-outline") as keyof typeof Ionicons.glyphMap,
    type: item.itemType,
    badgeColor: isLost
      ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    meta: metaParts.length > 0 ? metaParts.join(" - ") : "No details added",
  };
}

function HomeScreen({ navigation }: HomeScreenProps) {
  const [studentFullName, setStudentFullName] = useState<string>("");
  const [studentInitials, setStudentInitials] = useState<string>("");
  const [currentStudentId, setCurrentStudentId] = useState<string>("");
  const [lostCount, setLostCount] = useState<number>(0);
  const [foundCount, setFoundCount] = useState<number>(0);
  const [myReportsCount, setMyReportsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recentItems, setRecentItems] = useState<HomeItem[]>([]);

  async function fetchStudentData() {
    try {
      setIsLoading(true);

      const student = await getCurrentStudent();
      setCurrentStudentId(student.id);

      setStudentFullName(student.fullName.split(" ")[0]);
      if (student?.fullName) {
        const initials = student.fullName
          .trim()
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        setStudentInitials(initials);
      }
      
      // Load recent items with this student's ID directly
      loadRecentItems(student.id);
    } catch (error: any) {
      console.log("HOME STUDENT ERROR:", error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadRecentItems(studentId?: string) {
    try {
      const [lostItemsInUni, foundItemsInUni, myLost, myFound] = await Promise.all([
        getStudentLostItemsByUniversity(),
        getStudentFoundItemsByUniversity(),
        getMyLostItems(),
        getMyFoundItems(),
      ]);

      const targetStudentId = studentId || currentStudentId;
      setLostCount(lostItemsInUni.filter((i: any) => i.status?.toLowerCase() === "open" && i.studentId !== targetStudentId).length);
      setFoundCount(foundItemsInUni.filter((i: any) => i.status?.toLowerCase() === "open" && i.studentId !== targetStudentId).length);
      setMyReportsCount(myLost.length + myFound.length);

      const lost: HomeItem[] = lostItemsInUni.map((item: any) => ({ ...item, itemType: "Lost" }));
      const found: HomeItem[] = foundItemsInUni.map((item: any) => ({ ...item, itemType: "Found" }));
      
      let allItems = [...lost, ...found];

      // Filter out user's own items
      if (targetStudentId) {
        allItems = allItems.filter((i) => i.studentId !== targetStudentId);
      }

      allItems.sort((a, b) => {
        const dateA = new Date(a.lostDate || a.foundDate || a.createdAt).getTime();
        const dateB = new Date(b.lostDate || b.foundDate || b.createdAt).getTime();
        return dateB - dateA;
      });

      setRecentItems(allItems.slice(0, 3));
    } catch (error: any) {
      console.log("HOME RECENT ITEMS ERROR:", error?.message);
    }
  }

  useEffect(() => {
    fetchStudentData();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchStudentData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-zinc-950" showsVerticalScrollIndicator={false}>
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-3xl font-black text-slate-900 dark:text-white">
            Hello, {studentFullName || "Student"}
          </Text>
          <Text className="mt-2 text-base leading-6 text-slate-500 dark:text-gray-400">
            Manage lost and found activity across your campus.
          </Text>
        </View>

        <Pressable
          className="h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none active:opacity-80"
          onPress={() => navigation.navigate("Profile")}
        >
          {studentInitials ? (
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500">
              <Text className="text-xs font-black text-white tracking-wider">
                {studentInitials}
              </Text>
            </View>
          ) : (
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
              <Ionicons name="person-outline" size={18} color="#2563eb" />
            </View>
          )}
        </Pressable>
      </View>

      <View className="mb-6 mt-7 rounded-3xl bg-blue-600 p-5 dark:bg-blue-500">
        <Text className="text-xl font-bold text-white">
          Smart matching is ready
        </Text>
        <Text className="mt-2 text-sm leading-5 text-blue-100 dark:text-blue-50">
          Check suggested matches or report a new item in a few taps.
        </Text>
        <Pressable
          className="mt-5 h-11 items-center justify-center rounded-xl bg-white"
          onPress={() => navigation.navigate("Matches")}
        >
          <Text className="font-bold text-blue-600">View Matches</Text>
        </Pressable>
      </View>

      {/* STATS DASHBOARD GRID */}
      <View className="mb-6">
        <View className="flex-row gap-3 mb-3">
          {/* Campus Lost Card */}
          <Pressable
            className="flex-1 rounded-2xl bg-white p-4 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none active:opacity-80"
            onPress={() => navigation.navigate("Browse", { initialFilter: "Lost" })}
          >
            <View className="flex-row items-center justify-between">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40">
                <Ionicons name="alert-circle-outline" size={20} color="#dc2626" />
              </View>
              <Text className="text-2xl font-black text-red-600 dark:text-red-400">
                {lostCount}
              </Text>
            </View>
            <Text className="mt-3 text-sm font-black text-slate-800 dark:text-zinc-200">
              Campus Lost
            </Text>
            <Text className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              View reports →
            </Text>
          </Pressable>

          {/* Campus Found Card */}
          <Pressable
            className="flex-1 rounded-2xl bg-white p-4 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none active:opacity-80"
            onPress={() => navigation.navigate("Browse", { initialFilter: "Found" })}
          >
            <View className="flex-row items-center justify-between">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                <Ionicons name="checkmark-circle-outline" size={20} color="#059669" />
              </View>
              <Text className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {foundCount}
              </Text>
            </View>
            <Text className="mt-3 text-sm font-black text-slate-800 dark:text-zinc-200">
              Campus Found
            </Text>
            <Text className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              View reports →
            </Text>
          </Pressable>
        </View>

        {/* My Reports Shortcut Bar */}
        <Pressable
          className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-100 dark:border-blue-900/40 shadow-sm shadow-slate-300/60 dark:shadow-none flex-row items-center justify-between active:opacity-80"
          onPress={() => navigation.navigate("MyReports")}
        >
          <View className="flex-row items-center flex-1">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Ionicons name="document-text-outline" size={20} color="#ffffff" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-base font-black text-blue-900 dark:text-blue-300">
                My Reports
              </Text>
              <Text className="text-xs text-blue-700/70 dark:text-blue-300/70">
                Manage your submitted items
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="mr-2 h-7 min-w-[28px] items-center justify-center rounded-full bg-blue-600 px-2">
              <Text className="text-xs font-black text-white">{myReportsCount}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#2563eb" />
          </View>
        </Pressable>
      </View>

      <View className="mb-6 flex-row gap-3">
        <Pressable
          className="flex-1 h-12 flex-row items-center justify-center rounded-xl bg-red-600 active:opacity-85 shadow-sm shadow-red-300/40 dark:shadow-none"
          onPress={() => navigation.navigate("Report", { prefillType: "lost" })}
        >
          <Ionicons name="alert-circle-outline" size={18} color="#ffffff" />
          <Text className="ml-2 text-sm font-bold text-white">Report Lost</Text>
        </Pressable>

        <Pressable
          className="flex-1 h-12 flex-row items-center justify-center rounded-xl bg-emerald-600 active:opacity-85 shadow-sm shadow-emerald-300/40 dark:shadow-none"
          onPress={() => navigation.navigate("Report", { prefillType: "found" })}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
          <Text className="ml-2 text-sm font-bold text-white">Report Found</Text>
        </Pressable>
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">
          Recent items
        </Text>
        <Pressable onPress={() => navigation.navigate("Browse")}>
          <Text className="font-bold text-blue-600 dark:text-blue-500">
            See all
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-5" />
      ) : recentItems.length > 0 ? (
        <View className="pb-10">
          {recentItems.map((item) => {
            const cardItem = mapItemForCard(item);
            return (
              <Pressable 
                key={`${item.itemType}-${item.id}`} 
                onPress={() => navigation.navigate("ItemDetails", { item: cardItem })}
              >
                <ItemCard item={cardItem} />
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View className="mt-2 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 py-10 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none">
          <Ionicons name="layers-outline" size={32} color="#94a3b8" />
          <Text className="mt-3 text-sm font-medium text-slate-500 dark:text-gray-400">
            No recent items found
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

export default HomeScreen;
