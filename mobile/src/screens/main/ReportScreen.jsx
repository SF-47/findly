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

import CalendarModal from "../../components/CalendarModal";
import ScreenHeader from "../../components/ScreenHeader";
import { uploadItemImage } from "../../api/supabaseStorage";
import { getCategories } from "../../services/categoryService";
import {
  createMyFoundItem,
  createMyLostItem,
} from "../../services/itemService";
import CustomAlert from "../../components/CustomAlert";

const reportTypes = [
  {
    key: "lost",
    title: "Lost",
    label: "I lost something",
    hint: "Create a report so matching can search found items.",
    icon: "alert-circle-outline",
    color: "#e11d48",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-600 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
  },
  {
    key: "found",
    title: "Found",
    label: "I found something",
    hint: "Share what you found so the owner can identify it.",
    icon: "checkmark-circle-outline",
    color: "#059669",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
];

function TypeOption({ type, isSelected, isDisabled, onPress }) {
  return (
    <Pressable
      className={`h-12 flex-1 flex-row items-center justify-center rounded-2xl ${
        isSelected ? type.bg : "bg-transparent"
      }`}
      disabled={isDisabled}
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

export default function ReportScreen({ navigation }) {
  const [reportType, setReportType] = useState("lost");

  const [formInputs, setFormInputs] = useState({
    itemName: "",
    categoryId: "",
    categoryName: "",
    color: "",
    location: "",
    date: "",
    description: "",
    imageUrl: "",
  });
  const [categories, setCategories] = useState([]);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedImageAsset, setSelectedImageAsset] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertData, setAlertData] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  const selectedType = reportTypes.find((type) => type.key === reportType);
  const dateLabel = reportType === "lost" ? "Lost date" : "Found date";
  const datePlaceholder =
    reportType === "lost" ? "When did you lose it?" : "When did you find it?";

  useEffect(() => {
    loadCategories();
  }, []);

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

  function updateFormInput(name, value) {
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormInputs({
      itemName: "",
      categoryId: "",
      categoryName: "",
      color: "",
      location: "",
      date: "",
      description: "",
      imageUrl: "",
    });
    setSelectedImageAsset(null);
    setIsCategoryModalVisible(false);
    setSelectedDate(new Date());
    setIsDatePickerVisible(false);
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

    if (!selectedImageAsset) {
      return "Please add one clear item photo.";
    }

    return "";
  }

  function getErrorMessage(error) {
    const responseData = error?.response?.data;
    const validationErrors = responseData?.errors;

    if (Array.isArray(validationErrors)) {
      return validationErrors[0] || responseData?.message;
    }

    if (validationErrors && typeof validationErrors === "object") {
      const firstError = Object.values(validationErrors)[0];
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }

    return (
      responseData?.message || error?.message || "Could not create report."
    );
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleDateSelect(date) {
    if (!date) {
      return;
    }

    setSelectedDate(date);
    updateFormInput("date", formatDate(date));
    setIsDatePickerVisible(false);
  }

  function handleCategoryPress() {
    if (isSubmitting) {
      return;
    }

    if (isLoadingCategories) {
      return;
    }

    setIsCategoryModalVisible(true);
  }

  function handleCategorySelect(category) {
    setFormInputs((prev) => ({
      ...prev,
      categoryId: String(category.id),
      categoryName: category.name,
    }));
    setIsCategoryModalVisible(false);
  }

  function openDatePicker() {
    if (isSubmitting) {
      return;
    }

    setIsDatePickerVisible(true);
  }

  async function handlePhotoPress() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      
      const requestBody = {
        categoryId: Number(formInputs.categoryId),
        itemName: formInputs.itemName.trim(),
        description: formInputs.description.trim(),
        color: formInputs.color.trim(),
        location: formInputs.location.trim(),
        imageUrl,
      };

      if (reportType === "lost") {
        requestBody.lostDate = `${formInputs.date.trim()}T00:00:00Z`;
        await createMyLostItem(requestBody);
      } else {
        requestBody.foundDate = `${formInputs.date.trim()}T00:00:00Z`;
        await createMyFoundItem(requestBody);
      }
      showAlert(
        "success",
        "Report created",
        "Your report was submitted successfully.",
      );
      resetForm();
    } catch (error) {
      showAlert("error", "Report failed", getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1">
      <View className="pb-4 pt-2 flex-row justify-between items-start">
        <View className="flex-1 pr-2">
          <ScreenHeader
            title="Report item"
            subtitle="Add the key details students need to recognize the item."
          />
        </View>
        <Pressable 
          className="bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded-xl flex-row items-center mt-1"
          onPress={() => navigation.navigate("MyReports")}
        >
          <Ionicons name="list-outline" size={18} color="#2563eb" />
          <Text className="ml-1 font-bold text-sm text-blue-700 dark:text-blue-300">My reports</Text>
        </Pressable>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2 rounded-3xl bg-blue-600 p-5 dark:bg-blue-500">
        <View className="flex-row items-start">
          <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Ionicons name="sparkles-outline" size={25} color="#ffffff" />
          </View>

          <View className="flex-1">
            <Text className="text-xl font-black text-white">
              Clear reports match faster
            </Text>

            <Text className="mt-2 text-sm leading-5 text-blue-100">
              Use a specific name, exact place, color, and one useful photo.
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-5">
        <Text className="mb-3 text-sm font-black uppercase text-slate-500 dark:text-slate-400">
          Report type
        </Text>

        <View className="flex-row rounded-3xl bg-slate-100 p-1 dark:bg-zinc-900">
          {reportTypes.map((type) => (
            <TypeOption
              key={type.key}
              type={type}
              isSelected={reportType === type.key}
              isDisabled={isSubmitting}
              onPress={() => setReportType(type.key)}
            />
          ))}
        </View>
      </View>

      <View className="mt-5 rounded-3xl bg-white p-5 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80">
        <View className="mb-5 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-black text-slate-900 dark:text-white">
              Item details
            </Text>

            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Required information for the report.
            </Text>
          </View>

          <View className={`rounded-full px-3 py-1 ${selectedType.bg}`}>
            <Text
              className={`text-xs font-black uppercase ${selectedType.text}`}
            >
              {selectedType.title}
            </Text>
          </View>
        </View>

        {/* Item Name */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            Item name
          </Text>

          <View className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800">
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
            className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800"
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

          {!isLoadingCategories && categories.length === 0 ? (
            <View className="mt-2 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-zinc-800">
              <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                No categories found.
              </Text>
            </View>
          ) : null}

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
                  ListEmptyComponent={
                    <View className="rounded-2xl bg-slate-50 px-4 py-5 dark:bg-zinc-800">
                      <Text className="text-center font-semibold text-slate-500 dark:text-slate-400">
                        No matching categories.
                      </Text>
                    </View>
                  }
                  renderItem={({ item }) => {
                    const isSelected =
                      String(item.id) === String(formInputs.categoryId);

                    return (
                      <Pressable
                        className={`mb-3 rounded-2xl border px-4 py-4 ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                            : "border-slate-100 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900"
                        }`}
                        onPress={() => handleCategorySelect(item)}
                      >
                        <View className="flex-row items-center">
                          <Text className="flex-1 text-base font-black text-slate-900 dark:text-white">
                            {item.name}
                          </Text>

                          {isSelected ? (
                            <Ionicons
                              name="checkmark-circle"
                              size={22}
                              color="#2563eb"
                            />
                          ) : null}
                        </View>

                        {item.description ? (
                          <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {item.description}
                          </Text>
                        ) : null}
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

          <View className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800">
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

          <View className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800">
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
            className="h-14 flex-row items-center rounded-2xl bg-slate-50 px-4 dark:bg-zinc-800"
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

          <View className="min-h-32 flex-row items-start rounded-2xl bg-slate-50 px-4 py-4 dark:bg-zinc-800">
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

      <View className="mt-5 rounded-3xl bg-white p-5 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80">
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-black text-slate-900 dark:text-white">
              Item photo
            </Text>

            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add one clear image when available.
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
                <Ionicons
                  name="cloud-upload-outline"
                  size={28}
                  color="#2563eb"
                />
              </View>

              <Text className="mt-3 text-base font-black text-slate-900 dark:text-white">
                Upload photo
              </Text>

              <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                JPG or PNG, clear front view preferred
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

      <View className="mt-5 rounded-3xl bg-blue-50 p-5 dark:bg-zinc-900">
        <View className="flex-row">
          <Ionicons name="shield-checkmark-outline" size={23} color="#2563eb" />

          <View className="ml-3 flex-1">
            <Text className="font-black text-slate-900 dark:text-white">
              Privacy tip
            </Text>

            <Text className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
              Avoid sharing passwords, private codes, or full document numbers
              in the description.
            </Text>
          </View>
        </View>
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
          <Ionicons name="send-outline" size={19} color="#ffffff" />
        )}

        <Text className="ml-2 text-base font-black text-white">
          {isSubmitting ? "Saving..." : "Submit report"}
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
    </View>
  );
}
