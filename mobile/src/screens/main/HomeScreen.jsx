import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getCurrentStudent } from "../../services/studentService";

function HomeScreen({ navigation }) {
  const [studentFullName, setStudentFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function fetchStudentData() {
    try {
      setIsLoading(true);

      const student = await getCurrentStudent();

      setStudentFullName(student.fullName.split(" ")[0]);
    } catch (error) {
      console.log("HOME STUDENT ERROR:", error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentData();
  }, []);

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
          className="h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900"
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-outline" size={22} color="#2563eb" />
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

      <Text className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
        Recent items
      </Text>
    </ScrollView>
  );
}

export default HomeScreen;
