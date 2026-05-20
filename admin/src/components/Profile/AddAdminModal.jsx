import axiosClient from "../../api/axiosClient";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaLock,
  FaPlus,
  FaTimes,
  FaUserShield,
  FaUser,
  FaPhone,
} from "react-icons/fa";

function AddAdminModal({ onClose, onAdminAdded }) {
  const [inputs, setInputs] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullNameError: "",
    emailError: "",
    phoneError: "",
    passwordError: "",
  });

  function validateInputs() {
    const newErrors = {
      fullNameError: "",
      emailError: "",
      phoneError: "",
      passwordError: "",
    };

    let hasError = false;

    if (!inputs.fullName.trim()) {
      newErrors.fullNameError = "Full Name is required";
      hasError = true;
    }
    if (!inputs.email.trim()) {
      newErrors.emailError = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.emailError = "Please enter a valid email address";
      hasError = true;
    }
    if (!inputs.phoneNumber.trim()) {
      newErrors.phoneError = "Phone number is required.";
      hasError = true;
    } else if (!/^(03|70|71|76|78|79|81)\d{6}$/.test(inputs.phoneNumber)) {
      newErrors.phoneError = "Please enter a valid phone number.";
      hasError = true;
    }
    if (!inputs.password.trim()) {
      newErrors.passwordError = "Password is required";
      hasError = true;
    } else if (inputs.password.length < 6) {
      newErrors.passwordError = "Password must be at least 6 characters";
      hasError = true;
    } else if (inputs.password.length > 50) {
      newErrors.passwordError = "Password must be less than 50 characters";
      hasError = true;
    }

    setErrors(newErrors);
    return hasError;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const hasError = validateInputs();
    if (hasError) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      await axiosClient.post("/admins", inputs);

      toast.success("Admin added successfully.");
      await onAdminAdded();
      onClose();
    } catch (error) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const newErrors = {
          fullNameError: "",
          emailError: "",
          phoneError: "",
          passwordError: "",
        };

        backendErrors.forEach((err) => {
          const lowerError = err.toLowerCase();

          if (lowerError.includes("email") && lowerError.includes("already")) {
            newErrors.emailError = "This email is already used.";
          } else if (lowerError.includes("email")) {
            newErrors.emailError = err;
          } else {
            toast.error(err);
          }
          if (lowerError.includes("phone") && lowerError.includes("already")) {
            newErrors.phoneError = "This phone number is already used.";
          } else if (lowerError.includes("phone")) {
            newErrors.phoneError = err;
          }
        });
        setErrors(newErrors);
        return;
      }

      toast.error("Failed to add a new admin.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <FaTimes />
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-xl text-white shadow-md">
            <FaUserShield />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add Admin
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create a new administrator account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <FaUser className="text-blue-600 dark:text-blue-400" />
              Full Name
            </label>

            <input
              type="text"
              value={inputs.fullName}
              onChange={(e) => {
                setInputs((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }));
                setErrors((prev) => ({ ...prev, fullNameError: "" }));
              }}
              placeholder="Enter admin full name"
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 ${
                errors.fullNameError
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-200 dark:border-zinc-700"
              }`}
            />
            {errors.fullNameError && (
              <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                {errors.fullNameError}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <FaEnvelope className="text-blue-600 dark:text-blue-400" />
              Email
            </label>

            <input
              type="email"
              value={inputs.email}
              onChange={(e) => {
                setInputs((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
                setErrors((prev) => ({ ...prev, emailError: "" }));
              }}
              placeholder="admin@example.com"
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 ${
                errors.emailError
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-200 dark:border-zinc-700"
              }`}
            />
            {errors.emailError && (
              <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                {errors.emailError}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <FaPhone className="text-blue-600 dark:text-blue-400" />
              Phone
            </label>

            <input
              type="text"
              value={inputs.phoneNumber}
              onChange={(e) => {
                setInputs((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }));
                setErrors((prev) => ({ ...prev, phoneError: "" }));
              }}
              placeholder="01 234 567"
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 ${
                errors.phoneError
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-200 dark:border-zinc-700"
              }`}
            />
            {errors.phoneError && (
              <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                {errors.phoneError}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <FaLock className="text-blue-600 dark:text-blue-400" />
              Password
            </label>

            <input
              type="password"
              value={inputs.password}
              onChange={(e) => {
                setInputs((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
                setErrors((prev) => ({ ...prev, passwordError: "" }));
              }}
              placeholder="Enter admin password"
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 ${
                errors.passwordError
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-200 dark:border-zinc-700"
              }`}
            />
            {errors.passwordError && (
              <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                {errors.passwordError}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Default Access
            </p>

            <p className="mt-1 text-sm text-blue-600/80 dark:text-blue-300/80">
              This admin will have access to manage students, categories, lost
              items, found items, matches, and profile settings.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <FaPlus />
              {isLoading ? "Adding..." : "Add admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAdminModal;
