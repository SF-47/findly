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
import { getCurrentStudent } from "../../services/studentService";

const FILTER_TYPES = [
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
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    key: "Found",
    title: "Found",
    icon: "checkmark-circle-outline",
    color: "#059669",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
];

function TypeFilterOption({ type, isSelected, onPress }) {
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

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString();
}

function mapItemForCard(item) {
  const isLost = item.itemType === "Lost";
  const dateText = formatDate(isLost ? item.lostDate : item.foundDate);
  const metaParts = [item.categoryName, item.location, dateText].filter(
    Boolean,
  );

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

function EmptyState({ isLoading }) {
  return (
    <View className="rounded-2xl bg-white px-4 py-8 dark:bg-zinc-900">
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

export default function BrowseScreen({ navigation }) {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alertData, setAlertData] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });
  const [visibleCount, setVisibleCount] = useState(5);
  const [studentInitials, setStudentInitials] = useState("");

  const [showMyReports, setShowMyReports] = useState(true);
  const [currentStudentName, setCurrentStudentName] = useState("");

  function showAlert(type, title, message) {
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
        lostItemsInUni.map((item) => ({
          ...item,
          itemType: "Lost",
        })),
      );

      setFoundItems(
        foundItemsInUni.map((item) => ({
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
      if (student?.fullName) {
        setCurrentStudentName(student?.fullName);
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

  function openItemDetails(item) {
    navigation.getParent()?.navigate("ItemDetails", { item });
  }

  const allFilteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    const allItems = [...lostItems, ...foundItems];

    const filtered = allItems.filter((item) => {
      if (
        !showMyReports &&
        item.studentName?.toLowerCase() === currentStudentName?.toLowerCase()
      ) {
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
      const dateA = new Date(a.lostDate || a.foundDate || a.createdAt);
      const dateB = new Date(b.lostDate || b.foundDate || b.createdAt);

      return dateB - dateA;
    });
  }, [foundItems, lostItems, searchText, selectedType, showMyReports, currentStudentName]);

  const filteredItems = useMemo(
    () => allFilteredItems.slice(0, visibleCount),
    [allFilteredItems, visibleCount],
  );

  const totalFilteredCount = allFilteredItems.length;
  const canLoadMore = filteredItems.length < totalFilteredCount;
  const canShowLess = visibleCount > 10 && totalFilteredCount > 10;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-zinc-950">
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 28 }}
        data={filteredItems}
        keyExtractor={(item) => `${item.itemType}-${item.id}`}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<EmptyState isLoading={isLoading} />}
        ListHeaderComponent={
          <>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <ScreenHeader
                  title="Browse items"
                  subtitle="Search lost and found reports submitted by students."
                />
              </View>
            </View>

            <View className="mb-5 mt-7 h-12 flex-row items-center rounded-xl bg-white px-4 dark:bg-zinc-900">
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
            <Pressable
              className={`mb-5 flex-row items-center justify-center rounded-2xl p-4 ${
                showMyReports
                  ? "bg-slate-100 dark:bg-zinc-800"
                  : "bg-blue-50 dark:bg-blue-900/40"
              }`}
              onPress={() => setShowMyReports(!showMyReports)}
            >
              <Ionicons
                name={showMyReports ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={showMyReports ? "#64748b" : "#3b82f6"}
              />
              <Text
                className={`ml-2 font-bold ${
                  showMyReports
                    ? "text-slate-600 dark:text-zinc-300"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {showMyReports ? "Hide my reports" : "Show my reports"}
              </Text>
            </Pressable>
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
