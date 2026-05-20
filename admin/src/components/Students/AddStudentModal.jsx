import { useState } from "react";
import {
  FaEnvelope,
  FaIdCard,
  FaImage,
  FaPhone,
  FaPlus,
  FaTimes,
  FaUser,
  FaUniversity,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

function FormInput({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  errorMessage,
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
        <span className="text-blue-600 dark:text-blue-400">{icon}</span>
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 ${
          errorMessage
            ? "border-red-400 dark:border-red-500"
            : "border-gray-200 dark:border-zinc-700"
        }`}
      />
      {errorMessage && (
        <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function AddStudentModal({ onClose, onStudentAdded, universities }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    universityName: "",
    universityId: "",
    phoneNumber: "",
    universityCardImageUrl: "",
  });
  const [inputErrorMessage, setInputErrorMessage] = useState({
    fullNameError: "",
    emailError: "",
    universityNameError: "",
    universityIdError: "",
    phoneNumberError: "",
    universityCardImageUrlError: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateFrontend() {
    const errors = {
      fullNameError: "",
      emailError: "",
      universityNameError: "",
      universityIdError: "",
      phoneNumberError: "",
      universityCardImageUrlError: "",
    };

    let hasError = false;

    // Required fields
    if (!formData.fullName.trim()) {
      errors.fullNameError = "Full name is required.";
      hasError = true;
    }

    if (!formData.email.trim()) {
      errors.emailError = "Email is required.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.emailError = "Please enter a valid email address.";
      hasError = true;
    }

    if (!formData.universityName.trim()) {
      errors.universityNameError = "University name is required.";
      hasError = true;
    }

    if (!formData.universityId.trim()) {
      errors.universityIdError = "University ID is required.";
      hasError = true;
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumberError = "Phone number is required.";
      hasError = true;
    } else if (!/^(03|70|71|76|78|79|81)\d{6}$/.test(formData.phoneNumber)) {
      errors.phoneNumberError = "Please enter a valid phone number.";
      hasError = true;
    }

    if (!formData.universityCardImageUrl.trim()) {
      errors.universityCardImageUrlError =
        "University card image URL is required.";
      hasError = true;
    } else if (!formData.universityCardImageUrl.startsWith("http")) {
      errors.universityCardImageUrlError =
        "Please enter a valid URL starting with http:// or https://";
      hasError = true;
    }

    setInputErrorMessage(errors);
    return hasError; // Return true if there ARE errors
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // STEP 1: Frontend validation (fast UX feedback)
    const hasFrontendErrors = validateFrontend();
    if (hasFrontendErrors) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      await axiosClient.post("/students", formData);
      toast.success("Student added successfully");
      await onStudentAdded();
      onClose();
    } catch (error) {
      console.log(error);

      // STEP 2: Handle backend validation errors (unique constraints, etc.)
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        const newErrors = {
          fullNameError: "",
          emailError: "",
          universityNameError: "",
          universityIdError: "",
          phoneNumberError: "",
          universityCardImageUrlError: "",
        };

        let hasBackendError = false;

        backendErrors.forEach((err) => {
          const lowerError = err.toLowerCase();

          // Handle unique constraint errors that frontend can't validate
          if (lowerError.includes("email") && lowerError.includes("already")) {
            newErrors.emailError = "This email is already registered.";
            hasBackendError = true;
          } else if (
            lowerError.includes("phone") &&
            lowerError.includes("already")
          ) {
            newErrors.phoneNumberError =
              "This phone number is already registered.";
            hasBackendError = true;
          } else if (
            lowerError.includes("university id") &&
            lowerError.includes("already")
          ) {
            newErrors.universityIdError =
              "This university ID is already registered.";
            hasBackendError = true;
          }
          // For other validation errors (format, etc.), show them but frontend should have caught these
          else if (lowerError.includes("email")) {
            newErrors.emailError = err;
            hasBackendError = true;
          } else if (lowerError.includes("phone")) {
            newErrors.phoneNumberError = err;
            hasBackendError = true;
          } else {
            // Show other errors as toasts
            toast.error(err);
          }
        });

        if (hasBackendError) {
          setInputErrorMessage(newErrors);
        }
        return;
      }

      toast.error("Failed to add student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <FaTimes />
        </button>

        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-xl text-white shadow-md">
            <FaUser />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add Student
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create a new student account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              icon={<FaUser />}
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => {
                handleChange(e);
                setInputErrorMessage((prev) => ({
                  ...prev,
                  fullNameError: "",
                }));
              }}
              placeholder="Your full name"
              errorMessage={inputErrorMessage.fullNameError}
            />

            <FormInput
              icon={<FaEnvelope />}
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                handleChange(e);
                setInputErrorMessage((prev) => ({
                  ...prev,
                  emailError: "",
                }));
              }}
              placeholder="xxxx@example.com"
              errorMessage={inputErrorMessage.emailError}
            />
            <div className="relative flex flex-col">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <span className="text-blue-600 dark:text-blue-400">
                  <FaUniversity />
                </span>
                University
              </label>
              <select
                value={formData.universityName}
                onClick={() =>setClicked((prev) => !prev)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    universityName: e.target.value,
                  }))
                }
                className="w-full rounded-xl border appearance-none border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="">Select university name</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.split("(")[1].split(")")[0]}>{u}</option>
                ))}
              </select>
              {!clicked ? (
                <FaChevronRight className="pointer-events-none absolute right-3 top-10.5 dark:text-white text-gray-400 text-sm" />
              ) : (
                <FaChevronDown className="pointer-events-none absolute right-3 top-10.5 dark:text-white text-gray-400 text-sm" />
              )}
            </div>

            <FormInput
              icon={<FaIdCard />}
              label="University ID"
              name="universityId"
              value={formData.universityId}
              onChange={(e) => {
                handleChange(e);
                setInputErrorMessage((prev) => ({
                  ...prev,
                  universityIdError: "",
                }));
              }}
              placeholder="University ID"
              errorMessage={inputErrorMessage.universityIdError}
            />

            <FormInput
              icon={<FaPhone />}
              label="Phone"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => {
                handleChange(e);
                setInputErrorMessage((prev) => ({
                  ...prev,
                  phoneNumberError: "",
                }));
              }}
              placeholder="01 234 567"
              errorMessage={inputErrorMessage.phoneNumberError}
            />

            <FormInput
              icon={<FaImage />}
              label="Card Image URL"
              name="universityCardImageUrl"
              value={formData.universityCardImageUrl}
              onChange={(e) => {
                handleChange(e);
                setInputErrorMessage((prev) => ({
                  ...prev,
                  universityCardImageUrlError: "",
                }));
              }}
              placeholder="https://example.com/card.jpg"
              errorMessage={inputErrorMessage.universityCardImageUrlError}
            />
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-indigo-700"
              disabled={isLoading}
            >
              <FaPlus />
              {isLoading ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudentModal;
