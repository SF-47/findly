import { useState } from "react";
import { FaKey, FaLock, FaUsers, FaUserShield } from "react-icons/fa";
import ChangePasswordModal from "./ChangePasswordModal";
import LoginStatusModal from "./LoginStatusModal";
import AdminRoleModal from "./AdminRoleModal";
import AdminsModal from "./AdminsManagement";
import { isOwner } from "../../../utils/auth";
function ProfileSecurityCard({ onManageAdmins }) {
  const [showPassModal, setShowPassModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLoginStatusModal, setShowLoginStatusModal] = useState(false);
  const [showAdminsModal, setShowAdminsModal] = useState(false);

  const owner = isOwner();
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Account Security
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage administrator access and security options.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 ">
        <button
          onClick={() => setShowPassModal(true)}
          className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-500 dark:hover:bg-blue-950/30  cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white cursor-pointer">
            <FaKey />
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white cursor-pointer">
              Change Password
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
              Update admin login password.
            </p>
          </div>
        </button>

        <button
          className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left transition hover:border-purple-300 hover:bg-purple-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-purple-500 dark:hover:bg-purple-950/30 cursor-pointer"
          onClick={() => setShowRoleModal(true)}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white cursor-pointer">
            <FaUserShield />
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white cursor-pointer">
              Admin Role
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
              View current access level.
            </p>
          </div>
        </button>

        <button
          className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left transition hover:border-green-300 hover:bg-green-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-green-500 dark:hover:bg-green-950/30 cursor-pointer"
          onClick={() => setShowLoginStatusModal(true)}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white cursor-pointer">
            <FaLock />
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white cursor-pointer">
              Login Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
              Authentication will be connected later.
            </p>
          </div>
        </button>
        {owner && (
          <button
            type="button"
            onClick={onManageAdmins}
            className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-left transition hover:border-blue-400 hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white cursor-pointer">
              <FaUsers />
            </div>

            <div>
              <h1 className="font-bold text-blue-700 dark:text-blue-300 cursor-pointer">
                Manage Admins
              </h1>

              <p className="text-sm text-blue-500 dark:text-blue-400 cursor-pointer">
                View and manage administrator accounts.
              </p>
            </div>
          </button>
        )}
      </div>
      {showPassModal && (
        <ChangePasswordModal onClose={() => setShowPassModal(false)} />
      )}
      {showRoleModal && (
        <AdminRoleModal onClose={() => setShowRoleModal(false)} />
      )}

      {showLoginStatusModal && (
        <LoginStatusModal onClose={() => setShowLoginStatusModal(false)} />
      )}
      {showAdminsModal && (
        <AdminsModal onClose={() => setShowAdminsModal(false)} />
      )}
    </div>
  );
}

export default ProfileSecurityCard;
