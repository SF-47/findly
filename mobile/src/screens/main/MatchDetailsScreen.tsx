import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MatchDetailsScreenProps } from "../../navigation/types";
import { FoundItem, LostItem } from "../../types";
import { resolveMatch } from "../../services/matchService";
import CustomAlert from "../../components/CustomAlert";

export default function MatchDetailsScreen({ route, navigation }: MatchDetailsScreenProps) {
  const match = route.params?.match;
  const currentStudentName = route.params?.currentStudentName;

  const [matchStatus, setMatchStatus] = useState<string>(match?.status || "Pending");
  const [isResolving, setIsResolving] = useState<boolean>(false);

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
    onClose: () => void;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    onCancel?: () => void;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
    onClose: () => {},
  });

  if (!match) {
    return (
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          No match selected
        </Text>
        <Pressable
          className="mt-4 rounded-xl bg-blue-600 px-5 py-3 dark:bg-blue-500"
          onPress={() => navigation.goBack()}
        >
          <Text className="font-bold text-white">Go back</Text>
        </Pressable>
      </View>
    );
  }

  function showCustomAlert(
    type: "success" | "error" | "info",
    title: string,
    message: string,
    onCloseCallback?: () => void,
    showCancelButton = false,
    onCancelCallback?: () => void
  ) {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      onClose: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        if (onCloseCallback) onCloseCallback();
      },
      showCancelButton,
      onCancel: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        if (onCancelCallback) onCancelCallback();
      },
    });
  }

  async function handleResolveMatch() {
    showCustomAlert(
      "info",
      "Confirm Handover?",
      "Are you sure you want to mark this match as resolved? This confirms that the lost item has been returned to its owner.",
      async () => {
        try {
          setIsResolving(true);
          await resolveMatch(match.id);
          setMatchStatus("Resolved");
          showCustomAlert("success", "Match Resolved", "The match and reported items have been closed successfully.");
        } catch (error) {
          showCustomAlert("error", "Error", "Failed to resolve match. Please try again.");
        } finally {
          setIsResolving(false);
        }
      },
      true // showCancelButton
    );
  }

  function renderItemDetails(item: FoundItem | LostItem, isLost: boolean) {
    const isYours = item.studentName === currentStudentName;
    const typeLabel = isLost ? "Lost Item" : "Found Item";
    const typeColor = isLost
      ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    
    const rawDate = isLost 
      ? (item as LostItem).lostDate 
      : (item as FoundItem).foundDate;
      
    const dateText = new Date(
      item.date || rawDate || new Date(),
    ).toLocaleDateString();

    return (
      <View className="mb-5 rounded-3xl bg-white p-5 dark:bg-zinc-900">
        <View className="mb-4 flex-row items-center justify-between">
          <Text
            className={`rounded-full px-3 py-1 text-xs font-bold ${typeColor}`}
          >
            {typeLabel}
          </Text>
          {isYours && (
            <View
              className={`rounded px-2 py-0.5 ${isLost ? "bg-red-200 dark:bg-red-900/40" : "bg-emerald-200 dark:bg-emerald-900/40"}`}
            >
              <Text
                className={`text-[10px] font-bold ${isLost ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}
              >
                Yours
              </Text>
            </View>
          )}
        </View>

        {item.imageUrl ? (
          <Image
            className="mb-5 h-48 w-full rounded-2xl bg-slate-100 dark:bg-zinc-800"
            resizeMode="cover"
            source={{ uri: item.imageUrl }}
          />
        ) : (
          <View className="mb-5 h-48 w-full items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-800/50">
            <Ionicons name="image-outline" size={48} color="#94a3b8" />
            <Text className="mt-2 text-sm text-slate-400">
              No image provided
            </Text>
          </View>
        )}

        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {item.itemName}
        </Text>
        <Text className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
          Reported by: {item.studentName}
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {item.categoryName && (
            <View className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-zinc-800 mr-2 mb-2">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {item.categoryName}
              </Text>
            </View>
          )}
          {item.location && (
            <View className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-zinc-800 mr-2 mb-2">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {item.location}
              </Text>
            </View>
          )}
          {dateText && dateText !== "Invalid Date" && (
            <View className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-zinc-800 mr-2 mb-2">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {dateText}
              </Text>
            </View>
          )}
          {item.color && (
            <View className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-zinc-800 mr-2 mb-2">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Color: {item.color}
              </Text>
            </View>
          )}
        </View>

        <View className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-800/50">
          <Text className="text-sm font-bold text-gray-900 dark:text-white">
            Description
          </Text>
          <Text className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {item.description || "No description added for this item."}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-zinc-950" edges={["top", "bottom"]}>
      <View
        className="px-5 pt-4 pb-4 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800"
        style={{ zIndex: 10 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#64748b" />
          </Pressable>

          <Text className="text-base font-bold text-gray-900 dark:text-white">
            Match details
          </Text>

          <View className="h-11 w-11" />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 flex-row items-center justify-center rounded-3xl bg-blue-600 p-5 dark:bg-blue-500">
          <View className="flex-1 items-center">
            <Text className="text-white/80 text-xs font-bold uppercase tracking-wider">
              AI Confidence
            </Text>
            <Text className="mt-1 text-3xl font-black text-white">
              {match.matchPercentage}%
            </Text>
          </View>
          <View className="h-10 w-px bg-white/20 mx-4" />
          <View className="flex-1 items-center">
            <Text className="text-white/80 text-xs font-bold uppercase tracking-wider">
              Status
            </Text>
            <Text className="mt-1 text-lg font-bold text-white capitalize">
              {matchStatus}
            </Text>
          </View>
        </View>

        {renderItemDetails(match.lostItem, true)}

        <View className="mb-5 items-center justify-center">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
            <Ionicons name="swap-vertical" size={20} color="#3b82f6" />
          </View>
        </View>

        {renderItemDetails(match.foundItem, false)}

        {/* Dynamic Buttons based on Match Status */}
        {matchStatus.toLowerCase() === "confirmed" && (
          <View className="mt-5 mb-8 space-y-3">
            <Pressable
              className="flex-row items-center justify-center rounded-2xl bg-blue-600 py-4 dark:bg-blue-500"
              onPress={() =>
                navigation.navigate("Chat", {
                  matchId: match.id,
                  otherStudentName:
                    match.lostItem.studentName === currentStudentName
                      ? match.foundItem.studentName!
                      : match.lostItem.studentName!,
                  receiverId:
                    match.lostItem.studentName === currentStudentName
                      ? match.foundItem.studentId
                      : match.lostItem.studentId,
                })
              }
            >
              <Ionicons name="chatbubbles" size={24} color="white" />
              <Text className="ml-2 text-lg font-bold text-white">
                Chat with Student
              </Text>
            </Pressable>

            <Pressable
              className={`flex-row items-center mt-5 justify-center rounded-2xl bg-emerald-600 py-4 dark:bg-emerald-500 ${isResolving ? "opacity-60" : ""}`}
              onPress={handleResolveMatch}
              disabled={isResolving}
            >
              {isResolving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="white" />
                  <Text className="ml-2 text-lg font-bold text-white">
                    Confirm Handover & Close
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {matchStatus.toLowerCase() === "resolved" && (
          <View className="mt-5 mb-8 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 flex-row items-center justify-center">
            <Ionicons name="lock-closed" size={20} color="#64748b" />
            <Text className="ml-2 text-base font-bold text-slate-500 dark:text-slate-400">
              Match Resolved & Closed
            </Text>
          </View>
        )}

        {matchStatus.toLowerCase() !== "confirmed" && matchStatus.toLowerCase() !== "resolved" && (
          <View className="mt-5 mb-8 rounded-2xl bg-yellow-50 p-4 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/30 flex-row items-center justify-center">
            <Ionicons name="hourglass-outline" size={20} color="#d97706" />
            <Text className="ml-2 text-base font-bold text-amber-600 dark:text-amber-500">
              Awaiting Admin Confirmation
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Custom Modal Alert Overlay */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={alertConfig.onClose}
        showCancelButton={alertConfig.showCancelButton}
        onCancel={alertConfig.onCancel}
      />
    </SafeAreaView>
  );
}
