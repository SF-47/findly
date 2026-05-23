import {
  FaCheckCircle,
  FaShieldAlt,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";
import { isOwner } from "../../../utils/auth";

function AdminRoleModal({ onClose }) {
  const ownerPermissions = [
    "Manage all universities and branches",
    "Create and manage university admins",
    "Manage all students across all universities",
    "Verify or reject student accounts",
    "Create and update item categories",
    "Review all lost and found item records",
    "View and manage possible item matches",
    "Access profile and security settings",
  ];

  const universityAdminPermissions = [
    "Manage students from assigned university only",
    "Verify or reject students from assigned university only",
    "Review lost and found records from assigned university only",
    "View possible matches related to assigned university",
    "Use existing item categories when reviewing reports",
    "Access profile and security settings",
  ];

  const owner = isOwner();

  const currentRole = owner ? "Owner" : "University Admin";

  const roleDescription = owner
    ? "This account can manage global platform settings, universities, admins, students, reports, and categories."
    : "This account can manage students and records that belong only to its assigned university.";

  const permissions = owner ? ownerPermissions : universityAdminPermissions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <FaTimes />
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-purple-500 to-fuchsia-600 text-xl text-white shadow-md">
            <FaUserShield />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Role
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              View your access level and permissions.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
              <FaShieldAlt />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Current Role
              </p>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {currentRole}
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {roleDescription}
          </p>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Permissions
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {permissions.map((permission) => (
              <div
                key={permission}
                className="flex items-start gap-2 rounded-xl bg-gray-50 p-3 dark:bg-zinc-800"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300">
                  <FaCheckCircle size={13} />
                </div>

                <p className="text-xs font-medium leading-5 text-gray-700 dark:text-gray-300">
                  {permission}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-indigo-700"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default AdminRoleModal;
