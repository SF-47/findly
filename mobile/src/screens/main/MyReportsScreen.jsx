import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const reports = [
  {
    id: "1",
    title: "Black Backpack",
    type: "Lost",
    status: "Open",
    location: "Main library",
    date: "Jun 18, 2026",
  },
  {
    id: "2",
    title: "Student ID Card",
    type: "Found",
    status: "Matched",
    location: "Engineering block",
    date: "Jun 14, 2026",
  },
  {
    id: "3",
    title: "Wireless Earbuds",
    type: "Lost",
    status: "Closed",
    location: "Cafeteria",
    date: "Jun 9, 2026",
  },
];

function ReportCard({ report }) {
  const isLost = report.type === "Lost";
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
    <View className="mb-4 rounded-2xl bg-white p-4 dark:bg-zinc-900">
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
              {report.type} report
            </Text>
          </View>
          <Text className="text-lg font-bold text-slate-900 dark:text-white">
            {report.title}
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
              {report.date}
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
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-slate-50 px-5 dark:bg-zinc-950"
      contentContainerStyle={{
        paddingBottom: 40,
        paddingTop: Math.max(insets.top, 24) + 12,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6 flex-row items-center">
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

      <View className="mb-5 flex-row rounded-2xl bg-white p-4 dark:bg-zinc-900">
        <View className="flex-1">
          <Text className="text-2xl font-black text-slate-900 dark:text-white">
            3
          </Text>
          <Text className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total reports
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-black text-blue-600 dark:text-blue-400">
            1
          </Text>
          <Text className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Open
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            1
          </Text>
          <Text className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Matched
          </Text>
        </View>
      </View>

      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </ScrollView>
  );
}
