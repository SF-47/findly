import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMyFoundItems, getMyLostItems } from "../../services/itemService";
import { useEffect, useState } from "react";

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
  return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
}

function ReportCard({ report }) {
  const isLost = report.itemType === "Lost";
  const statusContainerStyle =
    report.status === "Matched"
      ? "bg-emerald-100 dark:bg-emerald-900/40"
      : report.status === "Closed"
        ? "bg-slate-100 dark:bg-zinc-800"
        : "bg-blue-100 dark:bg-blue-900/40";
  const statusTextStyle =
    report.status === "Matched"
      ? "text-emerald-700 dark:text-emerald-300"
      : report.status === "Closed"
        ? "text-slate-600 dark:text-zinc-300"
        : "text-blue-700 dark:text-blue-300";

  return (
    <View className="mb-4 rounded-2xl bg-white p-4 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none dark:bg-zinc-900">
      <View className="flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <View className="mb-2 flex-row items-center">
            <View
              className={`mr-2 h-9 w-9 items-center justify-center rounded-xl ${
                isLost
                  ? "bg-rose-100 dark:bg-rose-900/40"
                  : "bg-emerald-100 dark:bg-emerald-900/40"
              }`}
            >
              <Ionicons
                name={
                  isLost ? "alert-circle-outline" : "checkmark-circle-outline"
                }
                size={20}
                color={isLost ? "#e11d48" : "#059669"}
              />
            </View>
            <Text className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              {report.itemType} report
            </Text>
          </View>
          <Text className="text-lg font-bold text-slate-900 dark:text-white">
            {report.itemName}
          </Text>
          <View className="mt-3 flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#94a3b8" />
            <Text className="ml-1 text-sm text-slate-500 dark:text-slate-400">
              {report.location}
            </Text>
          </View>
          <View className="mt-2 flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#94a3b8" />
            <Text className="ml-1 text-sm text-slate-500 dark:text-slate-400">
              {formatDate(report.itemType === "Lost" ? report.lostDate : report.foundDate)}
            </Text>
          </View>
        </View>
        <View className={`rounded-full px-3 py-1 ${statusContainerStyle}`}>
          <Text className={`text-xs font-bold ${statusTextStyle}`}>
            {report.status}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function MyReportsScreen({ navigation }) {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [filter, setFilter] = useState("All");

  const allItems = [...lostItems, ...foundItems];
  
  const filteredItems = allItems.filter((item) => {
    if (filter === "All") return true;
    return item.itemType === filter;
  });

  const openCount = allItems.filter((item) => item.status === "Open").length;
  const matchedCount = allItems.filter((item) => item.status === "Matched").length;


  const insets = useSafeAreaInsets();

  async function fetchReportsCreatedByUser() {
    const [lostItemsByStudent, foundItemsByStudent] = await Promise.all([
      getMyLostItems(),
      getMyFoundItems(),
    ]);

    setLostItems(
      lostItemsByStudent.map((item) => ({ ...item, itemType: "Lost" })),
    );
    setFoundItems(
      foundItemsByStudent.map((item) => ({ ...item, itemType: "Found" })),
    );
  }

  useEffect(() => {
    fetchReportsCreatedByUser();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchReportsCreatedByUser();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-zinc-950">
      <View
        className="px-5 pb-4 bg-slate-50 dark:bg-zinc-950"
        style={{ paddingTop: Math.max(insets.top, 24) + 12, zIndex: 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-zinc-900"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#64748b" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-3xl font-bold text-slate-900 dark:text-white">
              My reports
            </Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review your lost and found item reports.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >

      <View className="mb-5 flex-row gap-3">
        <View className="flex-1 rounded-3xl bg-white p-4 dark:bg-zinc-900 shadow-sm shadow-slate-300/60 dark:shadow-none border border-slate-200 dark:border-zinc-800/80 items-center">
          <Text className="text-3xl font-black text-slate-900 dark:text-white">
            {allItems.length}
          </Text>
          <Text className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Total
          </Text>
        </View>
        <View className="flex-1 rounded-3xl bg-white p-4 dark:bg-zinc-900 shadow-sm shadow-slate-300/60 dark:shadow-none border border-slate-200 dark:border-zinc-800/80 items-center">
          <Text className="text-3xl font-black text-blue-600 dark:text-blue-400">
            {openCount}
          </Text>
          <Text className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Open
          </Text>
        </View>
        <View className="flex-1 rounded-3xl bg-white p-4 dark:bg-zinc-900 shadow-sm shadow-slate-300/60 dark:shadow-none border border-slate-200 dark:border-zinc-800/80 items-center">
          <Text className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {matchedCount}
          </Text>
          <Text className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Matched
          </Text>
        </View>
      </View>

      <View className="mb-5 flex-row rounded-3xl bg-slate-100 p-1 dark:bg-zinc-900">
        {FILTER_TYPES.map((type) => (
          <TypeFilterOption
            key={type.key}
            type={type}
            isSelected={filter === type.key}
            onPress={() => setFilter(type.key)}
          />
        ))}
      </View>

      {filteredItems.length === 0 ? (
        <View className="mt-10 items-center justify-center">
          <Ionicons name="document-text-outline" size={48} color="#94a3b8" />
          <Text className="mt-4 text-center text-base font-medium text-slate-500 dark:text-slate-400">
            No {filter !== "All" ? filter.toLowerCase() : ""} reports found.
          </Text>
        </View>
      ) : (
        filteredItems.map((report) => {
          const isLost = report.itemType === "Lost";
          const dateText = formatDate(
            isLost ? report.lostDate : report.foundDate,
          );
          const metaParts = [
            report.categoryName,
            report.location,
            dateText,
          ].filter(Boolean);

          const cardItem = {
            ...report,
            title: report.itemName || "Untitled item",
            icon: isLost ? "search-outline" : "checkmark-circle-outline",
            type: report.itemType,
            badgeColor: isLost
              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
            meta:
              metaParts.length > 0 ? metaParts.join(" - ") : "No details added",
          };

          return (
            <Pressable
              key={report.id || report._id}
              onPress={() =>
                navigation.navigate("ItemDetails", { item: cardItem, isMyReport: true })
              }
            >
              <ReportCard report={report} />
            </Pressable>
          );
        })
      )}
      </ScrollView>
    </View>
  );
}

