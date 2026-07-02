import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { getCurrentStudent } from "../../services/studentService";
import { getStudentFoundItemsByUniversity, getStudentLostItemsByUniversity } from "../../services/itemService";
import ItemCard from "../../components/ItemCard";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

function mapItemForCard(item) {
  const isLost = item.itemType === "Lost";
  const dateText = formatDate(isLost ? item.lostDate : item.foundDate);
  const metaParts = [item.categoryName, item.location, dateText].filter(Boolean);

  return {
    ...item,
    title: item.itemName || "Untitled item",
    icon: isLost ? "search-outline" : "checkmark-circle-outline",
    type: item.itemType,
    color: isLost
      ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    meta: metaParts.length > 0 ? metaParts.join(" - ") : "No details added",
  };
}

function HomeScreen({ navigation }) {
  const [studentFullName, setStudentFullName] = useState("");
  const [studentInitials, setStudentInitials] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentItems, setRecentItems] = useState([]);

  async function fetchStudentData() {
    try {
      setIsLoading(true);

      const student = await getCurrentStudent();

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
    } catch (error) {
      console.log("HOME STUDENT ERROR:", error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadRecentItems() {
    try {
      const [lostItemsInUni, foundItemsInUni] = await Promise.all([
        getStudentLostItemsByUniversity(),
        getStudentFoundItemsByUniversity(),
      ]);

      const lost = lostItemsInUni.map((item) => ({ ...item, itemType: "Lost" }));
      const found = foundItemsInUni.map((item) => ({ ...item, itemType: "Found" }));
      
      const allItems = [...lost, ...found].sort((a, b) => {
        const dateA = new Date(a.lostDate || a.foundDate || a.createdAt);
        const dateB = new Date(b.lostDate || b.foundDate || b.createdAt);
        return dateB - dateA;
      });

      setRecentItems(allItems.slice(0, 3));
    } catch (error) {
      console.log("HOME RECENT ITEMS ERROR:", error?.message);
    }
  }

  useEffect(() => {
    fetchStudentData();
    loadRecentItems();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchStudentData();
      loadRecentItems();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-3xl font-black text-slate-900 dark:text-white">
            Hello, {studentFullName || "Student"}
          </Text>
          <Text className="mt-2 text-base leading-6 text-slate-500 dark:text-gray-400">
            Manage lost and found activity across your campus.
          </Text>
        </View>

        <Pressable
          className="h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm active:opacity-80"
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

      <View className="mb-6 flex-row">
        <Pressable
          className="mr-3 flex-1 rounded-2xl bg-white p-4 dark:bg-zinc-900"
          onPress={() => navigation.navigate("Report")}
        >
          <Ionicons name="alert-circle-outline" size={26} color="#dc2626" />
          <Text className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
            Report Lost
          </Text>
          <Text className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Create a lost item report.
          </Text>
        </Pressable>

        <Pressable
          className="flex-1 rounded-2xl bg-white p-4 dark:bg-zinc-900"
          onPress={() => navigation.navigate("Report")}
        >
          <Ionicons name="checkmark-circle-outline" size={26} color="#059669" />
          <Text className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
            Report Found
          </Text>
          <Text className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Help return an item.
          </Text>
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
                key={`${item.itemType}-${item.id || item._id}`} 
                onPress={() => navigation.navigate("ItemDetails", { item: cardItem })}
              >
                <ItemCard item={cardItem} />
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View className="mt-2 items-center justify-center rounded-2xl bg-white py-10 dark:bg-zinc-900">
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
