import { useState } from "react";
import { FaEllipsisV, FaTags } from "react-icons/fa";

function CatCard() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group w-full cursor-pointer rounded-3xl border border-blue-100 bg-linear-to-br from-white via-slate-50 to-blue-50 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-2xl dark:border-zinc-700 dark:bg-none dark:bg-zinc-900 dark:hover:border-blue-300">
      <div className="relative flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg ring-2 ring-white/20">
          <FaTags size={22} />
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <FaEllipsisV size={14} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-10 z-50 w-28 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-700">
              Edit
            </button>

            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="mt-7">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Category Name
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Used to classify lost and found item reports.
        </p>

        <span className="mt-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-transparent dark:bg-blue-900/40 dark:text-blue-300">
          0 Reports
        </span>
      </div>

      <button className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-linear-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:text-blue-300 dark:hover:border-transparent dark:hover:text-white">
        <span>View Category</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </div>
  );
}

export default CatCard;