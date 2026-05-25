import {
  CircleCheck,
  Clock3,
  Mail,
  MapPin,
  ShieldUser,
  Users,
  X,
  Building2,
} from "lucide-react";

function StatPill({ icon, label, value, className }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${className}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function UniversityDetailsModal({ isOpen, onClose, university }) {
  if (!isOpen || !university) return null;

  const previewStats = {
    totalStudents: 128,
    verifiedStudents: 94,
    pendingStudents: 34,
  };

  const previewAdmin = {
    name: "Maya Khoury",
    email: "maya.khoury@example.com",
    role: "UniversityAdmin",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm lg:left-72">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="relative overflow-hidden border-b border-gray-200 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 px-5 py-4 dark:border-zinc-700">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg ring-1 ring-white/25 backdrop-blur-sm">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  University Details
                </h2>

                <p className="mt-0.5 text-xs text-blue-50">
                  Summary, admin, and student status.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/15 p-2 text-white transition hover:bg-white/25"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-3xl border border-blue-100 bg-linear-to-br from-white via-slate-50 to-blue-50 p-4 shadow-sm dark:border-zinc-700 dark:bg-none dark:bg-zinc-800">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg ring-2 ring-white/20">
                {university.shortName}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {university.shortName}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                  {university.fullName}
                </p>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
                  <MapPin size={12} />
                  {university.branch} Branch
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatPill
              icon={<Users size={17} />}
              label="Students"
              value={previewStats.totalStudents}
              className="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
            />

            <StatPill
              icon={<CircleCheck size={17} />}
              label="Verified"
              value={previewStats.verifiedStudents}
              className="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
            />

            <StatPill
              icon={<Clock3 size={17} />}
              label="Pending"
              value={previewStats.pendingStudents}
              className="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300"
            />
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                  <ShieldUser size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Assigned Admin
                  </h3>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Responsible administrator.
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
                Active
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-md">
                {previewAdmin.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                  {previewAdmin.name}
                </p>

                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  <Mail size={12} />
                  {previewAdmin.email}
                </p>
              </div>

              <span className="hidden rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 sm:inline-flex">
                {previewAdmin.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-5 py-3 dark:border-zinc-700 dark:bg-zinc-950/40">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UniversityDetailsModal;