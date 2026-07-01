import { useState } from "react";
import {
  IdCard,
  Image,
  Lock,
  Mail,
  Phone,
  Plus,
  University,
  User,
  X,
} from "lucide-react";
import { createStudent } from "../../services/studentService";
import toast from "react-hot-toast";
import PrimeDropdown from "../PrimeDropdown";
import { supabase } from "../../api/supabaseClient";

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
        className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 ${
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

async function uploadUniversityCardImage(file) {
  const fileExtension = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `students/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("universities-cards")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("universities-cards")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

function AddStudentModal({
  onClose,
  onStudentAdded,
  universities,
  owner,
  admin,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    universityId: owner ? "" : admin?.universityId || "",
    universityStudentId: "",
    phoneNumber: "",
    universityCardImageUrl: "",
  });
  const [inputErrorMessage, setInputErrorMessage] = useState({
    fullNameError: "",
    emailError: "",
    passwordError: "",
    universityIdError: "",
    universityStudentIdError: "",
    phoneNumberError: "",
    universityCardImageUrlError: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cardImageFile, setCardImageFile] = useState(null);
  const [cardImagePreview, setCardImagePreview] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCardImageChange(e) {
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

    setCardImageFile(file);
    setCardImagePreview(URL.createObjectURL(file));

    setInputErrorMessage((prev) => ({
      ...prev,
      universityCardImageUrlError: "",
    }));
  }

  function validateFrontend() {
    const errors = {
      fullNameError: "",
      emailError: "",
      passwordError: "",
      universityIdError: "",
      universityStudentIdError: "",
      phoneNumberError: "",
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

    if (!formData.password.trim()) {
      errors.passwordError = "Password is required.";
      hasError = true;
    } else if (formData.password.length < 6) {
      errors.passwordError = "Password must be at least 6 characters.";
      hasError = true;
    }

    if (!formData.universityId.trim()) {
      errors.universityIdError = "University is required.";
      hasError = true;
    }

    if (!formData.universityStudentId.trim()) {
      errors.universityStudentIdError = "Student university ID is required.";
      hasError = true;
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumberError = "Phone number is required.";
      hasError = true;
    } else if (!/^(03|70|71|76|78|79|81)\d{6}$/.test(formData.phoneNumber)) {
      errors.phoneNumberError = "Please enter a valid phone number.";
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

    if (!cardImageFile) {
      setInputErrorMessage((prev) => ({
        ...prev,
        universityCardImageUrlError: "University card image is required.",
      }));

      toast.error("Please choose a university card image.");
      return;
    }

    setIsLoading(true);

    try {
      const universityCardImageUrl =
        await uploadUniversityCardImage(cardImageFile);

      await createStudent({
        ...formData,
        universityCardImageUrl,
      });
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
          passwordError: "",
          universityIdError: "",
          universityStudentIdError: "",
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
            lowerError.includes("university student id") &&
            lowerError.includes("already")
          ) {
            newErrors.universityStudentIdError =
              "This student university ID is already used in this university.";
            hasBackendError = true;
          } else if (lowerError.includes("email")) {
            newErrors.emailError = err;
            hasBackendError = true;
          } else if (lowerError.includes("password")) {
            newErrors.passwordError = err;
            hasBackendError = true;
          } else if (lowerError.includes("phone")) {
            newErrors.phoneNumberError = err;
            hasBackendError = true;
          } else {
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
    <div className="admin-modal-overlay fixed inset-y-0 right-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <X />
        </button>

        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-xl text-white shadow-md">
            <User />
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
              icon={<User />}
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
              placeholder="Enter student's full name"
              errorMessage={inputErrorMessage.fullNameError}
            />

            <FormInput
              icon={<Mail />}
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
              placeholder="student@example.com"
              errorMessage={inputErrorMessage.emailError}
            />

            <FormInput
              icon={<Lock />}
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                setInputErrorMessage((prev) => ({
                  ...prev,
                  passwordError: "",
                }));
              }}
              placeholder="Enter student password"
              errorMessage={inputErrorMessage.passwordError}
            />

            {owner ? (
              <div className="flex flex-col">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">
                    <University />
                  </span>
                  University
                </label>

                <PrimeDropdown
                  value={formData.universityId}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      universityId: value,
                    }));

                    setInputErrorMessage((prev) => ({
                      ...prev,
                      universityIdError: "",
                    }));
                  }}
                  placeholder="Select university"
                  invalid={Boolean(inputErrorMessage.universityIdError)}
                  options={universities.map((u) => ({
                    value: u.id,
                    label: `${u.shortName} (${u.branch})`,
                  }))}
                />

                {inputErrorMessage.universityIdError && (
                  <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                    {inputErrorMessage.universityIdError}
                  </p>
                )}
              </div>
            ) : (
              <div className="relative flex flex-col">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">
                    <University />
                  </span>
                  University
                </label>

                <input
                  type="text"
                  disabled
                  value={
                    admin.universityShortName + " - " + admin.universityBranch
                  }
                  className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 p-3 text-sm text-gray-500 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-400"
                />

                {inputErrorMessage.universityIdError && (
                  <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                    {inputErrorMessage.universityIdError}
                  </p>
                )}
              </div>
            )}

            <FormInput
              icon={<IdCard />}
              label="Student University ID"
              name="universityStudentId"
              value={formData.universityStudentId}
              onChange={(e) => {
                handleChange(e);
                setInputErrorMessage((prev) => ({
                  ...prev,
                  universityStudentIdError: "",
                }));
              }}
              placeholder="Example: 20231234"
              errorMessage={inputErrorMessage.universityStudentIdError}
            />

            <FormInput
              icon={<Phone />}
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

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <span className="text-blue-600 dark:text-blue-400">
                  <Image />
                </span>
                University Card Image
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-blue-400  dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-500">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCardImageChange}
                  className="hidden"
                />

                {cardImagePreview ? (
                  <img
                    src={cardImagePreview}
                    alt="University card preview"
                    className="h-40 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Click to upload university card
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, or WEBP up to 5MB
                    </p>
                  </div>
                )}
              </label>

              {inputErrorMessage.universityCardImageUrlError && (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                  {inputErrorMessage.universityCardImageUrlError}
                </p>
              )}
            </div>
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
              <Plus />
              {isLoading ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudentModal;
