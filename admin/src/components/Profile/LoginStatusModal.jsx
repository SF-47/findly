import { CircleCheck, Clock, Database, LockKeyhole, Mail, X } from "lucide-react";

function LoginStatusModal({ onClose }) {
  const admin = JSON.parse(
    localStorage.getItem("admin") || sessionStorage.getItem("admin") || "null",
  );

  const isRemembered = !!localStorage.getItem("admin");

  const loginStats = [
    {
      label: "Signed In As",
      value: admin?.email || "No email found",
      icon: <Mail />,
    },
    {
      label: "Session Status",
      value: "Active",
      icon: <CircleCheck />,
    },
    {
      label: "Storage Type",
      value: isRemembered ? "Remembered session" : "Temporary session",
      icon: <Database />,
    },
    {
      label: "Session Duration",
      value: isRemembered ? "Saved after closing browser" : "Ends with session",
      icon: <Clock />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm lg:left-72">
      <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <X />
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 text-xl text-white shadow-md">
            <LockKeyhole />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Login Status
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              View your current admin session details.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white">
              <CircleCheck />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-green-700 dark:text-green-300">
                Authentication
              </p>

              <h2 className="text-lg font-bold text-green-700 dark:text-green-300">
                Logged In
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm text-green-700/80 dark:text-green-300/80">
            Your admin session is currently active.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {loginStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-gray-50 p-4 dark:bg-zinc-800"
            >
              <div className="mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                {stat.icon}
                <p className="text-xs font-semibold uppercase text-gray-400">
                  {stat.label}
                </p>
              </div>

              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
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

export default LoginStatusModal;




