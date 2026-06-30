import { useState } from "react";
import { Save, Tags, X } from "lucide-react";
import { createCategory, updateCategory } from "../../services/categoryService";
import toast from "react-hot-toast";

function EditCategoryModal({ isOpen, category, onClose, onSuccess }) {
  const [inputs, setInputs] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    full: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = Boolean(category);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    const name = inputs.name.trim();
    const description = inputs.description.trim();
    const nextErrors = {
      name: name ? "" : "Category name is required.",
      description: description ? "" : "Description is required.",
      full: "",
    };

    if (nextErrors.name || nextErrors.description) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsLoading(true);

      if (isEdit) {
        await updateCategory(category.id, {
          name,
          description,
        });
      } else {
        await createCategory({
          name,
          description,
        });
      }

      toast.success(
        isEdit
          ? "Category updated successfully."
          : "Category created successfully.",
      );
      await onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      const backendErrors = error.response?.data?.errors;

      setErrors((prev) => ({
        ...prev,
        full:
          Array.isArray(backendErrors) && backendErrors.length > 0
            ? backendErrors.join(" ")
            : `Failed to ${isEdit ? "update" : "create"} category. Please try again.`,
      }));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-modal-overlay fixed inset-y-0 right-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg">
              <Tags size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {isEdit ? "Edit Category" : "Add Category"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEdit
                  ? "Update the category name and description."
                  : "Create a category for lost and found reports."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <X />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {errors.full && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
              {errors.full}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Category Name
            </label>
            <input
              type="text"
              value={inputs.name}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Description
            </label>
            <textarea
              rows="4"
              value={inputs.description}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save />
            {isLoading
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCategoryModal;
