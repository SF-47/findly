import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View, ActivityIndicator, Linking } from "react-native";
import { useState, useEffect } from "react";
import { deleteMyFoundItem, deleteMyLostItem } from "../../services/itemService";
import { getCurrentStudent } from "../../services/studentService";
import { getSupportContact } from "../../services/studentActionsService";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "../../components/CustomAlert";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../types";

type Props = NativeStackScreenProps<MainStackParamList, "ItemDetails">;

export default function ItemDetailsScreen({ route, navigation }: Props) {
  const item = route.params?.item;

  const [isMyReport, setIsMyReport] = useState<boolean>(false);
  const [loadingSupport, setLoadingSupport] = useState<boolean>(false);

  const [alertData, setAlertData] = useState<{
    visible: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    showCancel: boolean;
    buttonText: string;
    onConfirm: () => void;
  }>({
    visible: false,
    type: "success",
    title: "",
    message: "",
    showCancel: false,
    buttonText: "OK",
    onConfirm: () => {},
  });

  function showAlert(
    type: "success" | "error",
    title: string,
    message: string,
    showCancel = false,
    buttonText = "OK",
    onConfirm: () => void = closeAlert
  ) {
    setAlertData({
      visible: true,
      type,
      title,
      message,
      showCancel,
      buttonText,
      onConfirm,
    });
  }

  function closeAlert() {
    setAlertData((prev) => ({ ...prev, visible: false }));
  }

  // Load auth user and verify ownership
  useEffect(() => {
    async function loadAuth() {
      try {
        const student = await getCurrentStudent();
        if (item) {
          setIsMyReport(item.studentId === student.id || route.params?.isMyReport === true);
        }
      } catch (err) {
        console.error("Failed to load auth student:", err);
      }
    }
    loadAuth();
  }, [item]);

  // Open WhatsApp Link for Support
  async function handleContactSupport() {
    setLoadingSupport(true);
    try {
      const contact = await getSupportContact();
      setLoadingSupport(false);
      
      let phone = contact.phoneNumber.replace(/[^0-9]/g, "");
      if (phone.length === 8 && (phone.startsWith("0") || phone.startsWith("7") || phone.startsWith("3") || phone.startsWith("8"))) {
        phone = "961" + phone;
      }
      
      const message = `Hello Support! I am writing regarding the item: "${item?.title}" (ID: ${item?.id}). I need assistance.`;
      const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
      }
    } catch (err) {
      setLoadingSupport(false);
      showAlert("error", "Failed", "Could not fetch support contact details at this time.");
    }
  }

  // Redirect to Report Screen with Prefills
  function handleClaimOrMatch() {
    if (!item) return;

    const targetType = item.type === "Found" ? "lost" : "found";

    (navigation.navigate as any)("MainTabs", {
      screen: "Report",
      params: {
        prefillType: targetType,
        prefillItemName: item.title,
        prefillCategoryId: item.categoryId?.toString(),
        prefillCategoryName: item.categoryName || "",
      },
    });
  }

  function handleDelete() {
    if (!item) return;

    showAlert(
      "error",
      "Delete report",
      "Are you sure you want to delete this report? This cannot be undone.",
      true,
      "Delete",
      async () => {
        try {
          if (item.type === "Lost") {
            await deleteMyLostItem(item.id);
          } else {
            await deleteMyFoundItem(item.id);
          }
          closeAlert();
          setTimeout(() => {
            showAlert("success", "Success", "Report deleted successfully.", false, "OK", () => {
              closeAlert();
              navigation.goBack();
            });
          }, 500);
        } catch (error) {
          closeAlert();
          setTimeout(() => {
            showAlert("error", "Error", "Could not delete the report. Please try again.", false, "OK", closeAlert);
          }, 500);
        }
      }
    );
  }

  function handleEdit() {
    if (item) {
      navigation.navigate("EditReport", { editItem: item });
    }
  }

  if (!item) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5 dark:bg-zinc-950">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          No item selected
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
            Item details
          </Text>

          <View className="h-11 w-11" />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-3xl bg-white p-5 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none dark:bg-zinc-900">
          
          {/* OWNERSHIP BADGE */}
          {isMyReport && (
            <View className="mb-4 self-start rounded-full bg-blue-100 dark:bg-blue-900/40 px-3 py-1">
              <Text className="text-xs font-black text-blue-600 dark:text-blue-400">
                Your Report
              </Text>
            </View>
          )}

          {item.imageUrl ? (
            <Image
              className="mb-5 h-56 w-full rounded-3xl bg-slate-100 dark:bg-zinc-800"
              resizeMode="cover"
              source={{ uri: item.imageUrl }}
            />
          ) : (
            <View className="mb-5 h-28 w-28 items-center justify-center rounded-3xl bg-blue-50 dark:bg-blue-900/40">
              <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={48} color="#3b82f6" />
            </View>
          )}

          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-3xl font-bold text-gray-900 dark:text-white">
                {item.title}
              </Text>
              <Text className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {item.meta}
              </Text>
            </View>

            <Text className={`rounded-full px-3 py-1 text-xs font-bold ${item.badgeColor}`}>
              {item.type}
            </Text>
          </View>

          <View className="mt-6 rounded-2xl bg-gray-50 p-4 dark:bg-zinc-800">
            <Text className="text-sm font-bold text-gray-900 dark:text-white">
              Description
            </Text>
            <Text className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {item.description || "No description added for this item."}
            </Text>
          </View>

          {/* REPORTER INFORMATION */}
          <View className="mt-6 flex-row items-center border-t border-slate-100 pt-4 dark:border-zinc-800">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <Ionicons name="person" size={18} color="#2563eb" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Reported by</Text>
              <Text className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                {item.studentName || "Verified Student"}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-5 rounded-3xl bg-white p-5 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none dark:bg-zinc-900">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {isMyReport ? "Manage report" : "Quick actions"}
          </Text>

          {!isMyReport && (
            <Text className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {item.type === "Found"
                ? "If this item belongs to you, click 'Claim this item' to submit a lost report. Our system will automatically match your report and link you both. If you have questions, click 'Contact Support' to open a WhatsApp chat directly with your university admin."
                : "If you found this item, click 'I found a match' to submit a found report. Our matching engine will compare your details and confirm the match. If you need help, click 'Contact Support' to WhatsApp the admin."
              }
            </Text>
          )}

          {isMyReport ? (
            item?.status?.toLowerCase() === "resolved" || item?.status?.toLowerCase() === "closed" || item?.status?.toLowerCase() === "matched" ? (
              <View className="mt-4 rounded-xl bg-slate-100 dark:bg-zinc-800 p-4 border border-slate-200 dark:border-zinc-700 flex-row items-center justify-center">
                <Ionicons name="lock-closed" size={18} color="#64748b" />
                <Text className="ml-2 font-bold text-slate-500 dark:text-slate-400">
                  Closed & Resolved (Locked)
                </Text>
              </View>
            ) : (
              <>
                <Pressable 
                  className="mt-4 h-14 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500"
                  onPress={handleEdit}
                >
                  <Text className="font-bold text-white">Edit report</Text>
                </Pressable>

                <Pressable 
                  className="mt-3 h-14 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50"
                  onPress={handleDelete}
                >
                  <Text className="font-bold text-red-700 dark:text-red-400">
                    Delete report
                  </Text>
                </Pressable>
              </>
            )
          ) : (
            <>
              <Pressable 
                className="mt-4 h-14 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500"
                onPress={handleClaimOrMatch}
              >
                <Text className="font-bold text-white">
                  {item.type === "Found" ? "Claim this item" : "I found a match"}
                </Text>
              </Pressable>

              {loadingSupport ? (
                <View className="mt-3 h-14 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-850">
                  <ActivityIndicator size="small" color="#64748b" />
                </View>
              ) : (
                <Pressable 
                  className="mt-3 h-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800"
                  onPress={handleContactSupport}
                >
                  <Text className="font-bold text-gray-800 dark:text-white">
                    Contact support
                  </Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertData.visible}
        type={alertData.type}
        title={alertData.title}
        message={alertData.message}
        showCancelButton={alertData.showCancel}
        buttonText={alertData.buttonText}
        onClose={alertData.onConfirm}
        onCancel={closeAlert}
      />
    </SafeAreaView>
  );
}
