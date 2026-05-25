import { CircleCheck, CircleX, ClipboardCheck, Eye, MoreVertical, PackageOpen, Trash2 } from "lucide-react";
import { useState } from "react";

function MatchCard() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
            Pending Match
          </span>

          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Possible Match
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Lost and found item similarity result.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <MoreVertical size={14} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 z-50 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-700">
                <Eye size={13} />
                View
              </button>

              <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white">
              <PackageOpen />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-red-600 dark:text-red-300">
                Lost Item
              </p>

              <h3 className="font-bold text-gray-900 dark:text-white">
                Lost item name
              </h3>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Category • Color • Location
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <ClipboardCheck />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-300">
                Found Item
              </p>

              <h3 className="font-bold text-gray-900 dark:text-white">
                Found item name
              </h3>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Category • Color • Location
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Match Percentage
          </p>

          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
            --%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
          <div className="h-full w-2/3 rounded-full bg-linear-to-r from-purple-500 to-indigo-600" />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
          <CircleCheck />
          Confirm
        </button>

        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
          <CircleX />
          Reject
        </button>
      </div>
    </div>
  );
}

export default MatchCard;

