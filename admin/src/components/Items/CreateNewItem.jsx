import { useEffect, useState } from "react";
import {
  Calendar,
  ClipboardCheck,
  FileText,
  Image,
  MapPin,
  PackageOpen,
  Palette,
  Plus,
  Tag,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import PrimeDropdown from "../PrimeDropdown";
import { supabase } from "../../api/supabaseClient";

function FieldLabel({ icon, children }) {
  return (
    <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
      <span className="text-blue-600 dark:text-blue-400">{icon}</span>
      {children}
    </label>
  );
}

const fieldClass =
  "w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500";

const initialFormData = {
  studentId: "",
  categoryId: "",
  itemName: "",
  description: "",
  color: "",
  location: "",
  foundDate: "",
  lostDate: "",
  imageUrl: "",
};

const initialInputErrors = {
  imageUrlError: "",
};

function CreateNewItem({
  isOpen,
  onClose,
  onSubmit,
  students = [],
  categories = [],
  isSubmitting = false,
  type = "lost",
}) {
  const isFound = type === "found";
  const dateFieldName = isFound ? "foundDate" : "lostDate";
  const itemLabel = isFound ? "Found Item" : "Lost Item";
  const itemLabelLower = isFound ? "found item" : "lost item";
  const [formData, setFormData] = useState(initialFormData);
  const [itemImageFile, setItemImageFile] = useState(null);
  const [itemImagePreview, setItemImagePreview] = useState("");
  const [inputErrorMessage, setInputErrorMessage] =
    useState(initialInputErrors);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const isBusy = isSubmitting || isUploadingImage;

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function resetForm() {
    setFormData(initialFormData);
    setItemImageFile(null);
    setItemImagePreview((previewUrl) => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      return "";
    });
    setInputErrorMessage(initialInputErrors);
    setIsUploadingImage(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.studentId || !formData.categoryId) {
      toast.error("Please select a student and category.");
      return;
    }

    if (!itemImageFile) {
      setInputErrorMessage((prev) => ({
        ...prev,
        imageUrlError: "Item image is required.",
      }));

      toast.error("Please choose an item image.");
      return;
    }

    try {
      setIsUploadingImage(true);

      const imageUrl = await uploadItemImage(itemImageFile, type);

      const requestBody = {
        studentId: formData.studentId,
        categoryId: Number(formData.categoryId),
        itemName: formData.itemName,
        description: formData.description,
        color: formData.color,
        location: formData.location,
        [dateFieldName]: formData[dateFieldName],
        imageUrl,
      };

      await onSubmit(requestBody);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to upload item image.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function uploadItemImage(file, itemType) {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const folder = itemType === "found" ? "found-items" : "lost-items";
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("items")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("items").getPublicUrl(filePath);

    return data.publicUrl;
  }

  function handleItemImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    setItemImageFile(file);
    setItemImagePreview((previousPreviewUrl) => {
      if (previousPreviewUrl) {
        URL.revokeObjectURL(previousPreviewUrl);
      }

      return URL.createObjectURL(file);
    });

    setInputErrorMessage((prev) => ({ ...prev, imageUrlError: "" }));
  }

  return (
    <div className="admin-modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 backdrop-blur-sm md:items-center">
      <div className="relative max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <button
          type="button"
          onClick={handleClose}
          disabled={isBusy}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <X />
        </button>

        <div className="mb-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-xl text-white shadow-md">
            {isFound ? <ClipboardCheck /> : <PackageOpen />}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create {itemLabel}
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add a new {itemLabelLower} report submitted by a student.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            <div>
              <FieldLabel icon={<User />}>Student</FieldLabel>
              <PrimeDropdown
                value={formData.studentId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, studentId: value }))
                }
                disabled={isBusy}
                placeholder="Select student"
                options={students.map((student) => ({
                  value: student.id,
                  label: `${student.fullName} ( ${student.universityShortName} - ${student.universityBranch} )`,
                }))}
              />
            </div>

            <div>
              <FieldLabel icon={<Tag />}>Category</FieldLabel>
              <PrimeDropdown
                value={formData.categoryId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, categoryId: value }))
                }
                disabled={isBusy}
                placeholder="Select category"
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
            </div>

            <div>
              <FieldLabel icon={<PackageOpen />}>Item Name</FieldLabel>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                disabled={isBusy}
                placeholder="Example: Wallet"
                className={fieldClass}
                required
              />
            </div>

            <div>
              <FieldLabel icon={<Palette />}>Color</FieldLabel>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                disabled={isBusy}
                placeholder="Example: Black"
                className={fieldClass}
                required
              />
            </div>

            <div>
              <FieldLabel icon={<MapPin />}>Location</FieldLabel>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isBusy}
                placeholder="Example: Library"
                className={fieldClass}
                required
              />
            </div>

            <div>
              <FieldLabel icon={<Calendar />}>
                {isFound ? "Found Date" : "Lost Date"}
              </FieldLabel>
              <input
                type="date"
                name={dateFieldName}
                value={formData[dateFieldName]}
                onChange={handleChange}
                disabled={isBusy}
                className={fieldClass}
                required
              />
            </div>

            <div className="md:col-span-2">
              <FieldLabel icon={<Image />}>Item Image</FieldLabel>

              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-center transition hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-500">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleItemImageChange}
                  disabled={isBusy}
                  className="hidden"
                />

                {itemImagePreview ? (
                  <img
                    src={itemImagePreview}
                    alt="Item preview"
                    className="max-h-40 w-full rounded-xl object-contain"
                  />
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Click to upload item image
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, or WEBP up to 5MB
                    </p>
                  </div>
                )}
              </label>

              {inputErrorMessage.imageUrlError && (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                  {inputErrorMessage.imageUrlError}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <FieldLabel icon={<FileText />}>Description</FieldLabel>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isBusy}
                rows="3"
                placeholder={`Describe the ${itemLabelLower}...`}
                className={`${fieldClass} resize-none`}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isBusy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus />
              {isBusy ? "Creating..." : `Create ${itemLabelLower}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNewItem;
