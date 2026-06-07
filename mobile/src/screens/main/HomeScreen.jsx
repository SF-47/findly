import ScreenHeader from "../../components/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable, ScrollView } from "react-native";
import ItemCard from "../../components/ItemCard";
import { itemCards } from "../../data/itemCards";

function HomeScreen({ navigation }) {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Hello, Sami"
        subtitle="Manage lost and found activity across your campus."
      />

      <View className="mb-6 rounded-3xl bg-blue-600 p-5 mt-7 dark:bg-blue-500">
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
          className="mr-3 flex-1 rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-900/40 dark:bg-zinc-900"
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
          className="flex-1 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-green-900/40 dark:bg-zinc-900"
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

      <Text className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
        Recent items
      </Text>
      {itemCards.slice(0, 2).map((item) => (
        <ItemCard item={item} key={item.title} />
      ))}
    </ScrollView>
  );
}

export default HomeScreen;
