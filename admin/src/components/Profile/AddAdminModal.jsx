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
} from "react-icons/fa";

function AddAdminModal({ onClose, onAdminAdded }) {
  const [inputs, setInputs] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      setIsLoading(true);

      await axiosClient.post("/admins", inputs);

      toast.success("Admin added successfully.");
      await onAdminAdded();
      onClose();
    } catch (error) {
      console.log(error);

      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        toast.error(backendErrors[0]);
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
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              placeholder="Enter admin full name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <FaEnvelope className="text-blue-600 dark:text-blue-400" />
              Email
            </label>

            <input
              type="email"
              value={inputs.email}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <FaLock className="text-blue-600 dark:text-blue-400" />
              Password
            </label>

            <input
              type="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              placeholder="Enter admin password"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
            />
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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
