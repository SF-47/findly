import { useState } from "react";
import {
  FaEnvelope,
  FaIdCard,
  FaImage,
  FaPhone,
  FaSave,
  FaTimes,
  FaTrash,
  FaUniversity,
  FaUser,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import ConfirmDialog from "../ConfirmDialog";

function FormInput({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  errorMessage,
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
        <span className="text-blue-600 dark:text-blue-400">{icon}</span>
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:placeholder:text-zinc-500 ${
          errorMessage
            ? "border-red-500 bg-red-50 focus:border-red-500 dark:border-red-500 dark:bg-red-950/20"
            : disabled
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-400"
              : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-800"
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

function StudentDetailsModal({ student, onClose, onStudentChanged , setFilters }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPending = !student?.isVerified;

  const [formData, setFormData] = useState({
    fullName: student?.fullName || "",
    email: student?.email || "",
    universityName: student?.universityName || "",
    universityId: student?.universityId || "",
    phoneNumber: student?.phoneNumber || "",
    universityCardImageUrl: student?.universityCardImageUrl || "",
  });

  const [inputErrorMessage, setInputErrorMessage] = useState({
    fullNameError: "",
    emailError: "",
    universityNameError: "",
    universityIdError: "",
    phoneNumberError: "",
    universityCardImageUrlError: "",
  });

  if (!student) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (!formData.fullName.trim()) {
      errors.fullNameError = "Full name is required.";
      hasError = true;
    }

    if (!formData.email.trim()) {
      errors.emailError = "Email is required.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.emailError =
        "Please enter a valid email address (e.g., name@example.com).";
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
    return hasError;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const hasFrontendErrors = validateFrontend();
    if (hasFrontendErrors) {
      toast.error("Please fix the errors before saving.");
      return;
    }

    setIsLoading(true);

    try {
      await axiosClient.put(`/students/${student.id}`, formData);
      toast.success("Student updated successfully.");
      await onStudentChanged();
      onClose();
    } catch (error) {
      console.log(error);
      const backendErrors = error.response?.data?.errors;

      const newErrors = {
        fullNameError: "",
        emailError: "",
        universityNameError: "",
        universityIdError: "",
        phoneNumberError: "",
        universityCardImageUrlError: "",
      };

      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((err) => {
          const lowerError = err.toLowerCase();
          if (lowerError.includes("email") && lowerError.includes("already")) {
            newErrors.emailError = err;
          } else if (
            lowerError.includes("phone") &&
            lowerError.includes("already")
          ) {
            newErrors.phoneNumberError = err;
          } else if (
            lowerError.includes("university id") &&
            lowerError.includes("already")
          ) {
            newErrors.universityIdError = err;
          } else if (lowerError.includes("email")) {
            newErrors.emailError = err;
          } else if (lowerError.includes("phone")) {
            newErrors.phoneNumberError = err;
          } else if (
            lowerError.includes("university id") ||
            lowerError.includes("student id")
          ) {
            newErrors.universityIdError = err;
          } else if (lowerError.includes("university name")) {
            newErrors.universityNameError = err;
          } else if (lowerError.includes("full name")) {
            newErrors.fullNameError = err;
          } else if (
            lowerError.includes("card") ||
            lowerError.includes("image")
          ) {
            newErrors.universityCardImageUrlError = err;
          } else {
            toast.error(err);
          }
        });
        setInputErrorMessage(newErrors);
        return;
      }
      toast.error("Failed to update student.");
    } finally {
      setIsLoading(false);
    }
  }

  function cancelEditing() {
    setFormData({
      fullName: student.fullName || "",
      email: student.email || "",
      universityName: student.universityName || "",
      universityId: student.universityId || "",
      phoneNumber: student.phoneNumber || "",
      universityCardImageUrl: student.universityCardImageUrl || "",
    });
    setInputErrorMessage({
      fullNameError: "",
      emailError: "",
      universityNameError: "",
      universityIdError: "",
      phoneNumberError: "",
      universityCardImageUrlError: "",
    });
    setIsEditing(false);
  }

  async function handleDelete() {
    try {
      await axiosClient.delete(`/students/${student.id}`);
      toast.success("Student deleted successfully.");
      onClose();
      setFilters();
      await onStudentChanged();
      
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete student.");
    }
  }

  async function handleVerify() {
    await axiosClient.put(`/students/${student.id}/verify`);
    toast.success("Student verified successfully.");
    await onStudentChanged();
    onClose();
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-md">
            {student.fullName?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Student Details
            </h1>

            <div className="mt-1 flex items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEditing
                  ? "Edit student information."
                  : "View student information."}
              </p>
              {/* Status badge based on isVerified boolean */}
              {student.isVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pending banner — only shown when student is not verified and not editing */}
        {isPending && !isEditing && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">
            <FaCheckCircle className="mt-0.5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Pending Verification
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500">
                This student is awaiting review. Verify their university card
                image before approving.
              </p>
            </div>
          </div>
        )}

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
              disabled={!isEditing}
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
                setInputErrorMessage((prev) => ({ ...prev, emailError: "" }));
              }}
              disabled={!isEditing}
              errorMessage={inputErrorMessage.emailError}
            />

            <FormInput
              icon={<FaUniversity />}
              label="University"
              name="universityName"
              value={formData.universityName}
              onChange={(e) => {
                handleChange(e);
                setInputErrorMessage((prev) => ({
                  ...prev,
                  universityNameError: "",
                }));
              }}
              disabled={!isEditing}
              errorMessage={inputErrorMessage.universityNameError}
            />

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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
              errorMessage={inputErrorMessage.universityCardImageUrlError}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <div></div>
            <ConfirmDialog
              title="Delete student?"
              description={`Are you sure you want to delete ${student.fullName}? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={handleDelete}
            >
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <FaTrash />
                Delete
              </button>
            </ConfirmDialog>

            {isPending && !isEditing && (
              <ConfirmDialog
                title="Verify student?"
                description={`Are you sure you want to verify ${student.fullName}? This will approve their account.`}
                confirmText="Verify"
                cancelText="Cancel"
                onConfirm={handleVerify}
              >
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-600 transition hover:bg-green-100 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400 dark:hover:bg-green-950/40"
                >
                  <FaCheckCircle />
                  Verify
                </button>
              </ConfirmDialog>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                "Saving..."
              ) : isEditing ? (
                <>
                  <FaSave />
                  Save
                </>
              ) : (
                <>
                  <FaEdit />
                  Edit
                </>
              )}
            </button>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={cancelEditing}
              disabled={isLoading}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel Editing
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default StudentDetailsModal;
