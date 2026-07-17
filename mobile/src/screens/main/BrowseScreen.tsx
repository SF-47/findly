import React, { useEffect, useMemo, useState } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, TextInput, Pressable, FlatList } from "react-native";
import ItemCard from "../../components/ItemCard";
import {
  getStudentFoundItemsByUniversity,
  getStudentLostItemsByUniversity,
} from "../../services/itemService";
import CustomAlert from "../../components/CustomAlert";
import { CardItem } from "../../types";
import { BrowseScreenProps } from "../../navigation/types";
import { getCurrentStudent } from "../../services/studentService";

interface FilterType {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}

const FILTER_TYPES: FilterType[] = [
  {
    key: "All",
    title: "All",
    icon: "apps-outline",
    color: "#2563eb",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    key: "Lost",
    title: "Lost",
    icon: "alert-circle-outline",
    color: "#e11d48",
    bg: "bg-red-100 dark:bg-red-950/40",
  },
  {
    key: "Found",
    title: "Found",
    icon: "checkmark-circle-outline",
    color: "#059669",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
];

interface TypeFilterOptionProps {
  type: FilterType;
  isSelected: boolean;
  onPress: () => void;
}

function TypeFilterOption({ type, isSelected, onPress }: TypeFilterOptionProps) {
  return (
    <Pressable
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
    </Pressable>
  );
}

function formatDate(value: string | undefined): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString();
}

interface BrowseItem {
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

function mapItemForCard(item: BrowseItem): CardItem {
  const isLost = item.itemType === "Lost";
  const dateText = formatDate(isLost ? item.lostDate : item.foundDate);
  const metaParts = [item.categoryName, item.location, dateText].filter(
    Boolean,
  );

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

interface EmptyStateProps {
  isLoading: boolean;
}

function EmptyState({ isLoading }: EmptyStateProps) {
  return (
    <View className="rounded-2xl bg-white px-4 py-8 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none">
      <Ionicons
        name={isLoading ? "hourglass-outline" : "search-outline"}
        size={28}
        color="#94a3b8"
        style={{ alignSelf: "center" }}
      />
      <Text className="mt-3 text-center font-bold text-slate-600 dark:text-slate-300">
        {isLoading ? "Loading items..." : "No matching items."}
      </Text>
      {!isLoading ? (
        <Text className="mt-1 text-center text-sm text-slate-400 dark:text-zinc-500">
          Try another search or filter.
        </Text>
      ) : null}
    </View>
  );
}

export default function BrowseScreen({ route, navigation }: BrowseScreenProps) {
  const [lostItems, setLostItems] = useState<BrowseItem[]>([]);
  const [foundItems, setFoundItems] = useState<BrowseItem[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<{
    visible: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [studentInitials, setStudentInitials] = useState<string>("");

  const [showMyReports, setShowMyReports] = useState<boolean>(true);
  const [currentStudentName, setCurrentStudentName] = useState<string>("");
  const [currentStudentId, setCurrentStudentId] = useState<string>("");

  function showAlert(type: "success" | "error", title: string, message: string) {
    setAlertData({
      visible: true,
      type,
      title,
      message,
    });
  }

  function closeAlert() {
    setAlertData((prev) => ({
      ...prev,
      visible: false,
    }));
  }

  async function loadItems({ refreshing = false } = {}) {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const [lostItemsInUni, foundItemsInUni] = await Promise.all([
        getStudentLostItemsByUniversity(),
        getStudentFoundItemsByUniversity(),
      ]);

      setLostItems(
        lostItemsInUni.map((item: any) => ({
          ...item,
          itemType: "Lost",
        })),
      );

      setFoundItems(
        foundItemsInUni.map((item: any) => ({
          ...item,
          itemType: "Found",
        })),
      );
    } catch {
      showAlert("error", "Items unavailable", "Could not load items.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function fetchStudentInitials() {
    try {
      const student = await getCurrentStudent();
      setCurrentStudentId(student.id);
      if (student?.fullName) {
        setCurrentStudentName(student?.fullName);
        const initials = student.fullName
          .trim()
          .split(" ")
          .map((part: string) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        setStudentInitials(initials);
      }
    } catch (error: any) {
      console.log("BROWSE STUDENT ERROR:", error?.message);
    }
  }

  useEffect(() => {
    loadItems();
    fetchStudentInitials();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchStudentInitials();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setVisibleCount(5);
  }, [searchText, selectedType]);

  useEffect(() => {
    if (route.params?.initialFilter) {
      setSelectedType(route.params.initialFilter);
    }
  }, [route.params?.initialFilter]);

  function openItemDetails(item: CardItem) {
    // Navigate via parent if using nested tabs, but navigate directly works in react navigation stack resolver too.
    const parentNav = navigation.getParent();
    if (parentNav) {
      (parentNav as any).navigate("ItemDetails", { item });
    } else {
      (navigation as any).navigate("ItemDetails", { item });
    }
  }

  const allFilteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    const allItems = [...lostItems, ...foundItems];

    const filtered = allItems.filter((item) => {
      // Exclude items reported by the current student
      if (currentStudentId && item.studentId === currentStudentId) {
        return false;
      }

      // Only show active open items
      if (item.status?.toLowerCase() !== "open") {
        return false;
      }

      const matchesType =
        selectedType === "All" || item.itemType === selectedType;

      if (!matchesType) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        item.itemName,
        item.description,
        item.location,
        item.categoryName,
        item.color,
        item.studentName,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.lostDate || a.foundDate || a.createdAt).getTime();
      const dateB = new Date(b.lostDate || b.foundDate || b.createdAt).getTime();

      return dateB - dateA;
    });
  }, [foundItems, lostItems, searchText, selectedType, currentStudentId]);

  const filteredItems = useMemo(
    () => allFilteredItems.slice(0, visibleCount),
    [allFilteredItems, visibleCount],
  );

  const totalFilteredCount = allFilteredItems.length;
  const canLoadMore = filteredItems.length < totalFilteredCount;
  const canShowLess = visibleCount > 10 && totalFilteredCount > 10;

  return (
    
    <View className="flex-1 bg-slate-50 dark:bg-zinc-950">
      <View className="flex-row items-start justify-between pb-2">
        <View className="flex-1 pr-4">
          <ScreenHeader
            title="Browse items"
            subtitle="Search lost and found reports submitted by students."
          />
        </View>
      </View>
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 28 }}
        data={filteredItems}
        keyExtractor={(item) => `${item.itemType}-${item.id}`}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<EmptyState isLoading={isLoading} />}
        ListHeaderComponent={
          <>
            <View className="mb-5 mt-2 h-12 flex-row items-center rounded-xl bg-white px-4 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none">
              <Ionicons name="search-outline" size={20} color="#64748b" />
              <TextInput
                className="ml-3 flex-1 text-base text-slate-900 dark:text-white"
                placeholder="Search by item, place, or category"
                placeholderTextColor="#94a3b8"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText ? (
                <Pressable onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={20} color="#94a3b8" />
                </Pressable>
              ) : null}
            </View>

            <View className="mb-5 flex-row rounded-3xl bg-slate-100 p-1 dark:bg-zinc-900">
              {FILTER_TYPES.map((type) => (
                <TypeFilterOption
                  key={type.key}
                  type={type}
                  isSelected={selectedType === type.key}
                  onPress={() => setSelectedType(type.key)}
                />
              ))}
            </View>

            <View className="mb-4 flex-row items-center rounded-xl bg-blue-50/50 dark:bg-blue-950/20 px-3 py-2 border border-blue-100/50 dark:border-blue-900/30">
              <Ionicons name="information-circle-outline" size={16} color="#3b82f6" />
              <Text className="ml-2 flex-1 text-xs text-blue-700 dark:text-blue-300 font-semibold">
                Your own submitted reports are excluded from this feed.
              </Text>
            </View>
          </>
        }
        ListFooterComponent={
          canLoadMore || canShowLess ? (
            <View className="mt-4 flex-row gap-3">
              {canShowLess ? (
                <Pressable
                  className="h-12 flex-1 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900"
                  onPress={() => setVisibleCount(5)}
                >
                  <Text className="font-black text-slate-700 dark:text-white">
                    Show less
                  </Text>
                </Pressable>
              ) : null}

              {canLoadMore ? (
                <Pressable
                  className="h-12 flex-1 items-center justify-center rounded-2xl bg-blue-600 dark:bg-blue-500"
                  onPress={() => setVisibleCount((prev) => prev + 10)}
                >
                  <Text className="font-black text-white">Load more</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null
        }
        refreshing={isRefreshing}
        renderItem={({ item }) => {
          const cardItem = mapItemForCard(item);

          return (
            <Pressable onPress={() => openItemDetails(cardItem)}>
              <ItemCard item={cardItem} />
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
        onRefresh={() => loadItems({ refreshing: true })}
      />

      <CustomAlert
        visible={alertData.visible}
        type={alertData.type}
        title={alertData.title}
        message={alertData.message}
        onClose={closeAlert}
      />
    </View>
  );
}
