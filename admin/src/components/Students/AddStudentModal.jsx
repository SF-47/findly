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

function AddStudentModal({ onClose, onStudentAdded }) {
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

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    const errors = {
      fullNameError: "",
      emailError: "",
      universityNameError: "",
      universityIdError: "",
      phoneNumberError: "",
      universityCardImageUrlError: "",
    };

    if (!formData.fullName.trim()) {
      errors.fullNameError = "Full name is required.";
    }

    if (!formData.email.trim()) {
      errors.emailError = "Email is required.";
    }

    if (!formData.universityName.trim()) {
      errors.universityNameError = "University name is required.";
    }

    if (!formData.universityId.trim()) {
      errors.universityIdError = "University ID is required.";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumberError = "Phone number is required.";
    }

    if (!formData.universityCardImageUrl.trim()) {
      errors.universityCardImageUrlError = "University card image is required.";
    }

    setInputErrorMessage(errors);

    return Object.values(errors).some((error) => error !== ""); //it returns bool value
    // we have object errors above , when i write Object.values(errors) , i will have this :
    //     [
    //   "",
    //   "Email is required.",
    //   "",
    //   "",
    //   ""
    // ]

    //.some() checks if at least one item passes a condition.
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const hasErrors = validateForm();
    if (hasErrors) {
      return;
    }
    try {
      await axiosClient.post("/students", formData);
      toast.success("Student added successfully");
      await onStudentAdded();
      onClose();
    } catch (error) {
      console.log(error);

      const backendErrors = error.response?.data?.errors; //  (?) If response exists, go to data.If data exists, go to errors.If something is missing, return undefined.

      const newErrors = {
        fullNameError: "",
        emailError: "",
        universityNameError: "",
        universityIdError: "",
        phoneNumberError: "",
        universityCardImageUrlError: "",
      };

      if (Array.isArray(backendErrors)) {
        //Only run this code if backendErrors is an array.
        backendErrors.forEach((err) => {
          const lowerError = err.toLowerCase();

          if (lowerError.includes("email")) {
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
          // If backendErrors is an array:
          // For each error:
          //   Convert it to lowercase
          //   If it contains "email", show it under Email input
          //   If it contains "phone", show it under Phone input
        });

        setInputErrorMessage(newErrors);
        return;
      }

      toast.error("Failed to add student.");
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
              placeholder="University name"
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
            >
              <FaPlus />
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudentModal;
