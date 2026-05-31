import { useState } from "react";
import {
  Calendar,
  ClipboardCheck,
  Eye,
  LucideUniversity,
  MapPin,
  MoreVertical,
  PackageOpen,
  Palette,
  Trash2,
  User,
} from "lucide-react";
import { isOwner } from "../../../utils/auth";
import ConfirmDialog from "../ConfirmDialog";

function ItemCard({ type, item, students, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const owner = isOwner();

  const isLost = type === "lost";

  const student = students?.find(
    (student) => student.id == item?.studentId,
  );

  


  function formatDate(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  }

  const accent = isLost
    ? {
        header: "from-blue-500 via-indigo-500 to-red-500",
        badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        icon: <PackageOpen />,

        focus: "focus:border-red-400 dark:focus:border-red-500",
      }
    : {
        header: "from-blue-500 via-indigo-500 to-emerald-500",
        badge:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        icon: <ClipboardCheck />,

        focus: "focus:border-emerald-400 dark:focus:border-emerald-500",
      };

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
      <div
        className={`border-b border-gray-200 bg-linear-to-r ${accent.header} p-5 dark:border-zinc-700`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl text-white shadow-md backdrop-blur-sm">
              {accent.icon}
            </div>

            <div>
              <h2 className="mt-3 text-xl font-bold text-white">
                {item?.itemName || "Untitled Item"}
              </h2>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              <MoreVertical size={14} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 z-50 w-32 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-700">
                  <Eye size={13} />
                  View
                </button>

                <ConfirmDialog
                  title={`Delete ${isLost ? "lost" : "found"} item?`}
                  description={`Are you sure you want to delete ${item?.itemName || "this item"}? This action cannot be undone.`}
                  onConfirm={() => {
                    setShowMenu(false);
                    onDelete?.(item.id);
                  }}
                  onCancel={() => setShowMenu(false)}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </ConfirmDialog>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Category Name
            </p>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {item?.description || "No description available."}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${accent.badge}`}
          >
            Open
          </span>
        </div>

        <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-3">
            <User className="text-blue-500" />
            <span>{student?.fullName || "Unknown student"}</span>
          </div>
          {owner && (
            <div className="flex items-center gap-3">
              <LucideUniversity className="text-blue-500" />
              <span>{student?.universityShortName +" - " + student?.universityBranch || "Not Assigned"}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <MapPin className="text-blue-500" />
            <span>{item?.location || "No location"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Palette className="text-blue-500" />
            <span>{item?.color || "No color"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-blue-500" />
            <span>
              {isLost
                ? formatDate(item?.lostDate) || "No date"
                : formatDate(item?.foundDate) || "No date"}
            </span>
          </div>
        </div>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-linear-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:text-blue-300 dark:hover:border-transparent dark:hover:text-white">
          View Details
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </div>
  );
}

export default ItemCard;
