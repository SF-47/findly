import { useState } from "react";
import { Eye, EyeOff, KeyRound, LockKeyhole, Save, X } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

function ChangePasswordModal({ onClose }) {
  const [inputs, setInputs] = useState({
    currentPass: "",
    newPass: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
  });
  const [errors, setErrors] = useState({
    currentPassError: "",
    newPassError: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  function validateInputs() {
    const newErrors = {
      currentPassError: "",
      newPassError: "",
    };

    if (!inputs.currentPass.trim()) {
      newErrors.currentPassError = "Current password is required.";
    }

    if (!inputs.newPass.trim()) {
      newErrors.newPassError = "New password is required.";
    } else if (inputs.newPass.length < 6) {
      newErrors.newPassError = "New password must be at least 6 characters.";
    }

    if (
      inputs.currentPass.trim() &&
      inputs.newPass.trim() &&
      inputs.newPass === inputs.currentPass
    ) {
      newErrors.newPassError =
        "New password must be different from current password.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).some((error) => error !== "");
  }
  const admin = JSON.parse(
    localStorage.getItem("admin") || sessionStorage.getItem("admin") || "null",
  );

  async function handleSubmit(e) {
    e.preventDefault();

    const hasErrors = validateInputs();
    if (hasErrors) {
      return;
    }
    try {
      setIsLoading(true);
      const request = {
        adminId: admin.id,
        currentPassword: inputs.currentPass,
        newPassword: inputs.newPass,
      };
      await axiosClient.put("/auth/admin/change-password", request);
      toast.success("Password changed successfully.");
      onClose();
    } catch (error) {
      console.log(error);
      console.log("Backend response:", error.response?.data);

      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        toast.error(backendErrors[0]);
        return;
      }

      if (backendErrors && typeof backendErrors === "object") {
        const firstError = Object.values(backendErrors).flat()[0];

        if (firstError) {
          toast.error(firstError);
          return;
        }
      }

      toast.error("Failed to change password.");
    } finally {
      setIsLoading(false);
    }

    console.log(inputs);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm lg:left-72">
      <div className="relative w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <X />
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-xl text-white shadow-md">
            <KeyRound />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Change Password
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your admin account password.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <LockKeyhole className="text-blue-600 dark:text-blue-400" />
              Current Password
            </label>

            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                value={inputs.currentPass}
                onChange={(e) => {
                  setInputs((prev) => ({
                    ...prev,
                    currentPass: e.target.value,
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    currentPassError: "",
                  }));
                }}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
              />
              {errors.currentPassError && (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.currentPassError}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-blue-500"
              >
                {showPassword.current ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <LockKeyhole className="text-blue-600 dark:text-blue-400" />
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                value={inputs.newPass}
                onChange={(e) => {
                  setInputs((prev) => ({
                    ...prev,
                    newPass: e.target.value,
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    newPassError: "",
                  }));
                }}
                placeholder="Enter new password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
              />
              {errors.newPassError && (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                  {errors.newPassError}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-blue-500"
              >
                {showPassword.new ? <EyeOff /> : <Eye />}
              </button>
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
              <Save />
              {isLoading ? "Changing..." : "Change"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;





