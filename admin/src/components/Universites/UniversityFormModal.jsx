import { useEffect, useState } from "react";
import { Save, University, X } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

function UniversityFormModal({
  isOpen,
  onClose,
  selectedUniversity,
  onSuccess,
}) {
  const [inputs, setInputs] = useState({
    shortName: "",
    fullName: "",
    branch: "",
  });

  const [errors, setErrors] = useState({
    shortNameError: "",
    fullNameError: "",
    branchError: "",
    fullError: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const isEdit = Boolean(selectedUniversity);

  useEffect(() => {
    if (selectedUniversity) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputs({
        shortName: selectedUniversity.shortName || "",
        fullName: selectedUniversity.fullName || "",
        branch: selectedUniversity.branch || "",
      });
    } else {
      setInputs({
        shortName: "",
        fullName: "",
        branch: "",
      });
    }

    setErrors({
      shortNameError: "",
      fullNameError: "",
      branchError: "",
      fullError: "",
    });
  }, [selectedUniversity, isOpen]);

  if (!isOpen) return null;

  function validateInputs() {
    let hasErrors = false;

    const newErrors = {
      shortNameError: "",
      fullNameError: "",
      branchError: "",
      fullError: "",
    };

    if (!inputs.shortName.trim()) {
      hasErrors = true;
      newErrors.shortNameError = "Short name is required.";
    }

    if (!inputs.fullName.trim()) {
      hasErrors = true;
      newErrors.fullNameError = "Full name is required.";
    }

    if (!inputs.branch.trim()) {
      hasErrors = true;
      newErrors.branchError = "Branch is required.";
    }

    if (
      !inputs.shortName.trim() &&
      !inputs.fullName.trim() &&
      !inputs.branch.trim()
    ) {
      hasErrors = true;
      newErrors.fullError = "Fill all the fields.";
    }

    setErrors(newErrors);
    return hasErrors;
  }

  async function handleAdd() {
    if (validateInputs()) {
      return;
    }

    try {
      setIsLoading(true);

      const cleanInputs = {
        shortName: inputs.shortName.trim().toUpperCase(),
        fullName: inputs.fullName.trim(),
        branch: inputs.branch.trim(),
      };

      await axiosClient.post("/universities", cleanInputs);

      toast.success("University added successfully.");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.log(error);

      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const newErrors = {
          shortNameError: "",
          fullNameError: "",
          branchError: "",
          fullError: "",
        };

        backendErrors.forEach((err) => {
          const lowerError = err.toLowerCase();

          if (lowerError.includes("exists")) {
            newErrors.fullError =
              "A university with the same short name, full name, and branch already exists.";
          } else if (lowerError.includes("short name")) {
            newErrors.shortNameError = err;
          } else if (lowerError.includes("full name")) {
            newErrors.fullNameError = err;
          } else if (lowerError.includes("branch")) {
            newErrors.branchError = err;
          } else {
            newErrors.fullError = err;
          }
        });

        setErrors(newErrors);
      } else {
        setErrors((prev) => ({
          ...prev,
          fullError: "Something went wrong. Please try again.",
        }));
      }

      toast.error("Failed to add university.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdate() {
    if (validateInputs()) {
      return;
    }

    if (!selectedUniversity?.id) {
      toast.error("University ID is missing.");
      return;
    }

    try {
      setIsLoading(true);

      const cleanInputs = {
        shortName: inputs.shortName.trim().toUpperCase(),
        fullName: inputs.fullName.trim(),
        branch: inputs.branch.trim(),
      };

      await axiosClient.put(
        `/universities/${selectedUniversity.id}`,
        cleanInputs,
      );

      toast.success("University updated successfully.");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.log(error);

      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const newErrors = {
          shortNameError: "",
          fullNameError: "",
          branchError: "",
          fullError: "",
        };

        backendErrors.forEach((err) => {
          const lowerError = err.toLowerCase();

          if (lowerError.includes("exists")) {
            newErrors.fullError =
              "A university with the same short name, full name, and branch already exists.";
          } else if (lowerError.includes("short name")) {
            newErrors.shortNameError = err;
          } else if (lowerError.includes("full name")) {
            newErrors.fullNameError = err;
          } else if (lowerError.includes("branch")) {
            newErrors.branchError = err;
          } else {
            newErrors.fullError = err;
          }
        });

        setErrors(newErrors);
      } else {
        setErrors((prev) => ({
          ...prev,
          fullError: "Something went wrong. Please try again.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-modal-overlay fixed inset-y-0 right-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg">
              <University size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {isEdit ? "Edit University" : "Add University"}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage short name, full name, and branch.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
          >
            <X />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {errors.fullError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
              {errors.fullError}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Short Name
            </label>

            <input
              type="text"
              placeholder="Example: LU"
              value={inputs.shortName}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  shortName: e.target.value.toUpperCase(),
                }))
              }
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500"
            />

            {errors.shortNameError && (
              <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                {errors.shortNameError}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Example: Lebanese University"
              value={inputs.fullName}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500"
            />

            {errors.fullNameError && (
              <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                {errors.fullNameError}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Branch
            </label>

            <input
              type="text"
              placeholder="Example: Hadath"
              value={inputs.branch}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, branch: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500"
            />

            {errors.branchError && (
              <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                {errors.branchError}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-zinc-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            onClick={isEdit ? handleUpdate : handleAdd}
          >
            <Save />
            {isLoading
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create University"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UniversityFormModal;





