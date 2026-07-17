import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMyFoundItems, getMyLostItems } from "../../services/itemService";
import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CardItem, MainStackParamList } from "../../types";

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
  return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
}

interface MyReportItem {
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

interface ReportCardProps {
  report: MyReportItem;
}

function ReportCard({ report }: ReportCardProps) {
  const isLost = report.itemType === "Lost";
  const statusContainerStyle =
    report.status?.toLowerCase() === "matched"
      ? "bg-emerald-100 dark:bg-emerald-900/40"
      : report.status?.toLowerCase() === "closed"
        ? "bg-slate-100 dark:bg-zinc-800"
        : "bg-blue-100 dark:bg-blue-900/40";
  const statusTextStyle =
    report.status?.toLowerCase() === "matched"
      ? "text-emerald-700 dark:text-emerald-300"
      : report.status?.toLowerCase() === "closed"
        ? "text-slate-600 dark:text-zinc-300"
        : "text-blue-700 dark:text-blue-300";

  return (
    <View className="mb-4 rounded-2xl bg-white p-4 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none dark:bg-zinc-900">
      <View className="flex-row items-start">
        {/* Left Side: Image or Icon */}
        <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/40">
          {report.imageUrl ? (
            <Image
              className="h-14 w-14 rounded-2xl"
              resizeMode="cover"
              source={{ uri: report.imageUrl }}
            />
          ) : (
            <Ionicons
              name={isLost ? "alert-circle-outline" : "checkmark-circle-outline"}
              size={25}
              color={isLost ? "#e11d48" : "#059669"}
            />
          )}
        </View>

        {/* Right Side: Details */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                {report.itemType} report
              </Text>
              <Text className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {report.itemName}
              </Text>
            </View>
            <View className={`rounded-full px-3 py-1 ${statusContainerStyle}`}>
              <Text className={`text-xs font-bold ${statusTextStyle}`}>
                {report.status}
              </Text>
            </View>
          </View>

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
      </View>
    </View>
  );
}

type Props = NativeStackScreenProps<MainStackParamList, "MyReports">;

export default function MyReportsScreen({ navigation }: Props) {
  const [lostItems, setLostItems] = useState<MyReportItem[]>([]);
  const [foundItems, setFoundItems] = useState<MyReportItem[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Resolved">("All");

  const allItems = [...lostItems, ...foundItems];
  
  const filteredItems = allItems.filter((item) => {
    // 1. Type Filter (All, Lost, Found)
    const matchesType = filter === "All" || item.itemType === filter;
    if (!matchesType) return false;

    // 2. Status Filter (All, Active, Resolved)
    const isResolved =
      item.status?.toLowerCase() === "resolved" ||
      item.status?.toLowerCase() === "closed";

    if (statusFilter === "Active") {
      return !isResolved; // only show open/matched items
    } else if (statusFilter === "Resolved") {
      return isResolved; // only show resolved/closed items
    }

    return true;
  });

  const activeCount = allItems.filter(
    (item) =>
      item.status?.toLowerCase() === "open" ||
      item.status?.toLowerCase() === "matched"
  ).length;

  const resolvedCount = allItems.filter(
    (item) =>
      item.status?.toLowerCase() === "resolved" ||
      item.status?.toLowerCase() === "closed"
  ).length;

  // insets removed

  async function fetchReportsCreatedByUser() {
    const [lostItemsByStudent, foundItemsByStudent] = await Promise.all([
      getMyLostItems(),
      getMyFoundItems(),
    ]);

    setLostItems(
      lostItemsByStudent.map((item: any) => ({ ...item, itemType: "Lost" })),
    );
    setFoundItems(
      foundItemsByStudent.map((item: any) => ({ ...item, itemType: "Found" })),
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
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-zinc-950" edges={["top", "bottom"]}>
      <View
        className="px-5 pt-4 pb-4 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800"
        style={{ zIndex: 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800"
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
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5 flex-row gap-3">
          <View className="flex-1 rounded-3xl bg-white p-4 dark:bg-zinc-900 shadow-sm border border-slate-200 dark:border-zinc-800/80 items-center">
            <Text className="text-3xl font-black text-slate-900 dark:text-white">
              {allItems.length}
            </Text>
            <Text className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Total
            </Text>
          </View>
          <View className="flex-1 rounded-3xl bg-white p-4 dark:bg-zinc-900 shadow-sm border border-slate-200 dark:border-zinc-800/80 items-center">
            <Text className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {activeCount}
            </Text>
            <Text className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Active
            </Text>
          </View>
          <View className="flex-1 rounded-3xl bg-white p-4 dark:bg-zinc-900 shadow-sm border border-slate-200 dark:border-zinc-800/80 items-center">
            <Text className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {resolvedCount}
            </Text>
            <Text className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Resolved
            </Text>
          </View>
        </View>

        {/* Category Type Filter (Lost, Found, All) */}
        <View className="mb-4 flex-row rounded-3xl bg-slate-100 p-1 dark:bg-zinc-900">
          {FILTER_TYPES.map((type) => (
            <TypeFilterOption
              key={type.key}
              type={type}
              isSelected={filter === type.key}
              onPress={() => setFilter(type.key)}
            />
          ))}
        </View>

        {/* Status Filter (All, Active, Resolved) */}
        <View className="mb-5 flex-row gap-2 bg-slate-100/50 dark:bg-zinc-900/50 p-1 rounded-2xl">
          {(["All", "Active", "Resolved"] as const).map((status) => {
            const isSel = statusFilter === status;
            return (
              <Pressable
                key={status}
                onPress={() => setStatusFilter(status)}
                className={`flex-1 h-9 items-center justify-center rounded-xl transition-all ${
                  isSel
                    ? "bg-white dark:bg-zinc-800 shadow-xs"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSel
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {status}
                </Text>
              </Pressable>
            );
          })}
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

            const cardItem: CardItem = {
              ...report,
              title: report.itemName || "Untitled item",
              icon: (isLost ? "search-outline" : "checkmark-circle-outline") as keyof typeof Ionicons.glyphMap,
              type: report.itemType,
              badgeColor: isLost
                ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
              meta:
                metaParts.length > 0 ? metaParts.join(" - ") : "No details added",
            };

            return (
              <Pressable
                key={report.id}
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
    </SafeAreaView>
  );
}
