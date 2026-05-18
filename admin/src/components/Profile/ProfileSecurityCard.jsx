import { FaKey, FaLock, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ProfileSecurityCard() {
  const navigate = useNavigate();
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

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <button className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-500 dark:hover:bg-blue-950/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
            <FaKey />
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Change Password
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update admin login password.
            </p>
          </div>
        </button>

        <button className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left transition hover:border-purple-300 hover:bg-purple-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-purple-500 dark:hover:bg-purple-950/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white">
            <FaUserShield />
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Admin Role
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View current access level.
            </p>
          </div>
        </button>

        <button className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left transition hover:border-green-300 hover:bg-green-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-green-500 dark:hover:bg-green-950/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
            <FaLock />
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Login Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Authentication will be connected later.
            </p>
          </div>
        </button>

        <button className="flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-left transition hover:border-red-400 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:hover:bg-red-950/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white">
            <FaSignOutAlt />
          </div>

          <div>
            <button
              className="font-bold text-red-700 dark:text-red-300"
              onClick={() => {
                localStorage.removeItem("admin");
                sessionStorage.removeItem("admin");
                navigate("/");
              }}
            >
              Logout
            </button>
            <p className="text-sm text-red-500 dark:text-red-400">
              End current admin session.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default ProfileSecurityCard;
