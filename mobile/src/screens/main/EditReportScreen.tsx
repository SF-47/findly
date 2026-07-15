import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import CalendarModal from "../../components/CalendarModal";
import ScreenHeader from "../../components/ScreenHeader";
import { uploadItemImage } from "../../api/supabaseStorage";
import { getCategories } from "../../services/categoryService";
import {
  updateMyLostItem,
  updateMyFoundItem,
} from "../../services/itemService";
import CustomAlert from "../../components/CustomAlert";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CardItem, Category, MainStackParamList } from "../../types";

type Props = NativeStackScreenProps<MainStackParamList, "EditReport">;

export default function EditReportScreen({ route, navigation }: Props) {
  // insets removed
  const editItem = route.params.editItem;
  
  const reportType = editItem.itemType === "Lost" ? "lost" : "found";
  const initialDate = editItem.itemType === "Lost" 
    ? (editItem.lostDate ? editItem.lostDate.split("T")[0] : "") 
    : (editItem.foundDate ? editItem.foundDate.split("T")[0] : "");

  const [formInputs, setFormInputs] = useState<{
    itemName: string;
    categoryId: string;
    categoryName: string;
    color: string;
    location: string;
    date: string;
    description: string;
    imageUrl: string;
  }>({
    itemName: editItem.itemName || "",
    categoryId: String(editItem.categoryId),
    categoryName: editItem.categoryName || "",
    color: editItem.color || "",
    location: editItem.location || "",
    date: initialDate,
    description: editItem.description || "",
    imageUrl: editItem.imageUrl || "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate ? new Date(initialDate) : new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const [selectedImageAsset, setSelectedImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  const dateLabel = reportType === "lost" ? "Lost date" : "Found date";
  const datePlaceholder = reportType === "lost" ? "When did you lose it?" : "When did you find it?";

  useEffect(() => {
    loadCategories();
  }, []);

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

  async function loadCategories() {
    try {
      setIsLoadingCategories(true);
      const data = await getCategories();
      setCategories(data);
    } catch {
      showAlert(
        "error",
        "Categories unavailable",
        "Could not load categories.",
      );
    } finally {
      setIsLoadingCategories(false);
    }
  }

  function updateFormInput(name: string, value: string) {
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    if (
      !formInputs.itemName.trim() ||
      !formInputs.categoryId ||
      !formInputs.color.trim() ||
      !formInputs.location.trim() ||
      !formInputs.date.trim() ||
      !formInputs.description.trim()
    ) {
      return "Please fill in all report details.";
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(formInputs.date.trim())) {
      return "Date must use YYYY-MM-DD format.";
    }

    return "";
  }

  function getErrorMessage(error: any): string {
    const responseData = error?.response?.data;
    const validationErrors = responseData?.errors;

    if (Array.isArray(validationErrors)) {
      return validationErrors[0] || responseData?.message;
    }

    if (validationErrors && typeof validationErrors === "object") {
      const firstError = Object.values(validationErrors)[0];
      return Array.isArray(firstError) ? firstError[0] : (firstError as string);
    }

    return (
      responseData?.message || error?.message || "Could not save report."
    );
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;
    setSelectedDate(date);
    updateFormInput("date", formatDate(date));
    setIsDatePickerVisible(false);
  }

  function handleCategoryPress() {
    if (isSubmitting || isLoadingCategories) return;
    setIsCategoryModalVisible(true);
  }

  function handleCategorySelect(category: Category) {
    setFormInputs((prev) => ({
      ...prev,
      categoryId: String(category.id),
      categoryName: category.name,
    }));
    setIsCategoryModalVisible(false);
  }

  function openDatePicker() {
    if (isSubmitting) return;
    setIsDatePickerVisible(true);
  }

  async function handlePhotoPress() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showAlert(
          "error",
          "Permission needed",
          "Please allow photo access to upload an item photo.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setSelectedImageAsset(asset);
        updateFormInput("imageUrl", asset.uri);
      }
    } catch {
      showAlert("error", "Image error", "Could not select image.");
    }
  }

  async function handleSubmitReport() {
    const validationError = validateForm();

    if (validationError) {
      showAlert("error", "Missing information", validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl = formInputs.imageUrl;
      if (selectedImageAsset) {
        imageUrl = await uploadItemImage(selectedImageAsset, reportType);
      }
      
      const requestBody: any = {
        categoryId: Number(formInputs.categoryId),
        itemName: formInputs.itemName.trim(),
        description: formInputs.description.trim(),
        color: formInputs.color.trim(),
        location: formInputs.location.trim(),
        imageUrl,
      };

      if (reportType === "lost") {
        requestBody.lostDate = `${formInputs.date.trim()}T00:00:00Z`;
        await updateMyLostItem(editItem.id, requestBody);
      } else {
        requestBody.foundDate = `${formInputs.date.trim()}T00:00:00Z`;
        await updateMyFoundItem(editItem.id, requestBody);
      }
      showAlert(
        "success",
        "Report updated",
        "Your changes were saved successfully.",
      );
      
      // Navigate back after successful save
      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (error: any) {
      showAlert("error", "Update failed", getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-zinc-950" edges={["top", "bottom"]}>
      <View
        className="px-5 pt-4 pb-4 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800"
        style={{ zIndex: 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-slate-200 dark:border-zinc-800"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#64748b" />
          </Pressable>
          <ScreenHeader
            title="Edit report"
            subtitle="Update the details of your report."
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2 rounded-3xl bg-white p-5 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 shadow-sm shadow-slate-300/60 dark:shadow-none">
          <View className="mb-5 flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-white">
                Item details
              </Text>

              <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Update the required information.
              </Text>
            </View>
          </View>

          {/* Item Name */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              Item name
            </Text>

            <View className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800">
              <Ionicons name="pricetag-outline" size={19} color="#64748b" />

              <TextInput
                className="ml-3 flex-1 text-base font-semibold text-slate-900 dark:text-white"
                editable={!isSubmitting}
                placeholder="Backpack, student ID, USB-C charger"
                placeholderTextColor="#94a3b8"
                value={formInputs.itemName}
                onChangeText={(text) => updateFormInput("itemName", text)}
              />
            </View>
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              Category
            </Text>

            <Pressable
              className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800"
              disabled={isSubmitting}
              onPress={handleCategoryPress}
            >
              <Ionicons name="grid-outline" size={19} color="#64748b" />

              <Text
                className={`ml-3 flex-1 text-base font-semibold ${
                  formInputs.categoryName
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400"
                }`}
              >
                {isLoadingCategories
                  ? "Loading categories..."
                  : formInputs.categoryName || "Choose category"}
              </Text>

              {isLoadingCategories ? (
                <ActivityIndicator color="#2563eb" />
              ) : (
                <Ionicons name="chevron-down" size={18} color="#94a3b8" />
              )}
            </Pressable>

            <Modal
              animationType="slide"
              onRequestClose={() => setIsCategoryModalVisible(false)}
              transparent
              visible={isCategoryModalVisible}
            >
              <View className="flex-1 justify-end bg-black/50">
                <View className="max-h-[80%] rounded-t-3xl bg-white px-5 pb-6 pt-5 dark:bg-zinc-950">
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-2xl font-black text-slate-900 dark:text-white">
                      Choose category
                    </Text>

                    <Pressable
                      className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800"
                      onPress={() => setIsCategoryModalVisible(false)}
                    >
                      <Ionicons name="close" size={22} color="#64748b" />
                    </Pressable>
                  </View>

                  <FlatList
                    data={categories}
                    keyboardShouldPersistTaps="handled"
                    keyExtractor={(category) => String(category.id)}
                    renderItem={({ item }) => {
                      const isSelected = String(item.id) === String(formInputs.categoryId);

                      return (
                        <Pressable
                          className={`mb-3 rounded-2xl border px-4 py-4 ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                              : "border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900"
                          }`}
                          onPress={() => handleCategorySelect(item)}
                        >
                          <View className="flex-row items-center">
                            <Text className="flex-1 text-base font-black text-slate-900 dark:text-white">
                              {item.name}
                            </Text>

                            {isSelected ? (
                              <Ionicons name="checkmark-circle" size={22} color="#2563eb" />
                            ) : null}
                          </View>
                        </Pressable>
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </Modal>
          </View>

          {/* Color */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              Color
            </Text>

            <View className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800">
              <Ionicons name="color-palette-outline" size={19} color="#64748b" />

              <TextInput
                className="ml-3 flex-1 text-base font-semibold text-slate-900 dark:text-white"
                editable={!isSubmitting}
                placeholder="Black, red, silver"
                placeholderTextColor="#94a3b8"
                value={formInputs.color}
                onChangeText={(text) => updateFormInput("color", text)}
              />
            </View>
          </View>

          {/* Location */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              Location
            </Text>

            <View className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800">
              <Ionicons name="location-outline" size={19} color="#64748b" />

              <TextInput
                className="ml-3 flex-1 text-base font-semibold text-slate-900 dark:text-white"
                editable={!isSubmitting}
                placeholder="Library, cafeteria, lab"
                placeholderTextColor="#94a3b8"
                value={formInputs.location}
                onChangeText={(text) => updateFormInput("location", text)}
              />
            </View>
          </View>

          {/* Date */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              {dateLabel}
            </Text>

            <Pressable
              className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800"
              disabled={isSubmitting}
              onPress={openDatePicker}
            >
              <Ionicons name="calendar-outline" size={19} color="#64748b" />

              <Text
                className={`ml-3 flex-1 text-base font-semibold ${
                  formInputs.date
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400"
                }`}
              >
                {formInputs.date || datePlaceholder}
              </Text>

              <Ionicons name="chevron-down" size={18} color="#94a3b8" />
            </Pressable>

            <CalendarModal
              isVisible={isDatePickerVisible}
              maximumDate={new Date()}
              onClose={() => setIsDatePickerVisible(false)}
              onSelectDate={handleDateSelect}
              selectedDate={selectedDate}
              subtitle="Select the report date"
              title={dateLabel}
            />
          </View>

          {/* Description */}
          <View>
            <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              Description
            </Text>

            <View className="min-h-32 flex-row items-start rounded-2xl bg-slate-50 px-4 py-4 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800">
              <Ionicons
                name="document-text-outline"
                size={19}
                color="#64748b"
                style={{ marginTop: 4 }}
              />

              <TextInput
                className="ml-3 flex-1 text-base font-semibold leading-6 text-slate-900 dark:text-white"
                editable={!isSubmitting}
                multiline
                placeholder="Add brand, unique marks, contents, or anything only the owner might know."
                placeholderTextColor="#94a3b8"
                textAlignVertical="top"
                value={formInputs.description}
                onChangeText={(text) => updateFormInput("description", text)}
              />
            </View>
          </View>
        </View>

        <View className="mt-5 rounded-3xl bg-white p-5 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 shadow-sm shadow-slate-300/60 dark:shadow-none">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-white">
                Item photo
              </Text>
              <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Update the item image if needed.
              </Text>
            </View>
            <Ionicons name="image-outline" size={24} color="#64748b" />
          </View>

          <Pressable
            className="h-40 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800"
            disabled={isSubmitting}
            onPress={handlePhotoPress}
          >
            {formInputs.imageUrl ? (
              <Image
                className="h-full w-full rounded-3xl"
                resizeMode="cover"
                source={{ uri: formInputs.imageUrl }}
              />
            ) : (
              <>
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40">
                  <Ionicons name="cloud-upload-outline" size={28} color="#2563eb" />
                </View>
                <Text className="mt-3 text-base font-black text-slate-900 dark:text-white">
                  Upload photo
                </Text>
              </>
            )}
          </Pressable>

          {formInputs.imageUrl ? (
            <Pressable
              className="mt-3 h-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30"
              disabled={isSubmitting}
              onPress={handlePhotoPress}
            >
              <Text className="font-black text-blue-600 dark:text-blue-300">
                Change photo
              </Text>
            </Pressable>
          ) : null}
        </View>

        <Pressable
          className={`mt-5 h-14 flex-row items-center justify-center rounded-2xl ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 dark:bg-blue-500"
          }`}
          disabled={isSubmitting}
          onPress={handleSubmitReport}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Ionicons name="save-outline" size={19} color="#ffffff" />
          )}

          <Text className="ml-2 text-base font-black text-white">
            {isSubmitting ? "Saving..." : "Save changes"}
          </Text>
        </Pressable>
        <CustomAlert
          visible={alertData.visible}
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          onClose={closeAlert}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
