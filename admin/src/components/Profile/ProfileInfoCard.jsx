import {
  FaEnvelope,
  FaIdBadge,
  FaShieldAlt,
  FaUserCircle,
} from "react-icons/fa";

function ProfileInfoCard() {
  return (
    <div className="h-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="h-32 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600" />

      <div className="-mt-12 px-6 pb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-white text-5xl text-blue-600 shadow-lg dark:border-zinc-900 dark:bg-zinc-800 dark:text-blue-400">
          <FaUserCircle />
        </div>

        <div className="mt-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Name
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Smart Lost & Found system administrator
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-zinc-800">
            <FaEnvelope className="text-blue-500" />

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Email
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                admin@example.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-zinc-800">
            <FaIdBadge className="text-purple-500" />

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Role
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-zinc-800">
            <FaShieldAlt className="text-green-500" />

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Access
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Full management access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfoCard;