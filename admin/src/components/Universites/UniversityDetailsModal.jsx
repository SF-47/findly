import {
  FaTimes,
  FaUniversity,
  FaUsers,
  FaUserShield,
  FaMapMarkerAlt,
} from "react-icons/fa";

function UniversityDetailsModal({ isOpen, onClose, university }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg">
              {university.shortName}
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {university.fullName}
              </h2>

              <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FaMapMarkerAlt className="text-blue-500" />
                {university.branch} Branch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                <FaUniversity />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  University
                </p>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {university.shortName}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                <FaUsers />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Students
                </p>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Coming soon
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                <FaUserShield />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Admins
                </p>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Coming soon
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-5 pb-5 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <FaUsers className="text-blue-500" />
              Students
            </h3>

            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-zinc-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Students for this university will be shown here after we connect
                the students API by universityId.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <FaUserShield className="text-blue-500" />
              Admins
            </h3>

            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-zinc-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                University admins will be shown here after we connect the admins
                API by universityId.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 px-5 py-4 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UniversityDetailsModal;