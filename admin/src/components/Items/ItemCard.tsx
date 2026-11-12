import { useState } from "react";
import {
  ArrowRight,
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
  // Dynamic Category Icons
  FileText,
  Smartphone,
  Key,
  Wallet,
  Shirt,
} from "lucide-react";
import { isOwner } from "../../../utils/auth";
import ConfirmDialog from "../ConfirmDialog";
import ItemDetailsModal from "./ItemDetailsModal";
import { ExtendedFoundItem, ExtendedLostItem, ExtendedStudent } from "../../types";

interface ItemCardProps {
  type: "lost" | "found";
  item: ExtendedFoundItem | ExtendedLostItem;
  students?: ExtendedStudent[];
  onDelete?: (id: string) => void;
}

function getCategoryIcon(categoryName?: string | null, isLost = true) {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("document") || name.includes("card") || name.includes("stationery") || name.includes("id")) {
    return <FileText size={22} />;
  }
  if (name.includes("electronic") || name.includes("phone") || name.includes("laptop") || name.includes("mobile")) {
    return <Smartphone size={22} />;
  }
  if (name.includes("key")) {
    return <Key size={22} />;
  }
  if (name.includes("wallet") || name.includes("bag") || name.includes("purse") || name.includes("backpack")) {
    return <Wallet size={22} />;
  }
  if (name.includes("clothing") || name.includes("cloth") || name.includes("apparel") || name.includes("shirt") || name.includes("wear")) {
    return <Shirt size={22} />;
  }
  return isLost ? <PackageOpen size={22} /> : <ClipboardCheck size={22} />;
}

function ItemCard({ type, item, students, onDelete }: ItemCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const owner = isOwner();

  const isLost = type === "lost";

  const student = students?.find((student) => String(student.id) === String(item?.studentId));

  const categoryIcon = getCategoryIcon(item?.categoryName, isLost);

  function formatDate(date?: string | null) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  }

  const accent = isLost
    ? {
        header: "from-blue-500 via-indigo-500 to-red-500",
        badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        focus: "focus:border-red-400 dark:focus:border-red-500",
      }
    : {
        header: "from-blue-500 via-indigo-500 to-emerald-500",
        badge:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        focus: "focus:border-emerald-400 dark:focus:border-emerald-500",
      };

  const status = item?.status || "Open";
  const university =
    [student?.universityShortName, student?.universityBranch]
      .filter(Boolean)
      .join(" - ") || "Not Assigned";

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
      <div
        className={`border-b border-gray-200 bg-linear-to-r ${accent.header} p-5 dark:border-zinc-700`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-md backdrop-blur-sm">
              {categoryIcon}
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
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
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowDetails(true);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-700"
                >
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
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
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
              {item?.categoryName || "Uncategorized"}
            </p>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {item?.description || "No description available."}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${accent.badge}`}
          >
            {status}
          </span>
        </div>

        <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-3">
            <User className="text-blue-500" size={16} />
            <span>{student?.fullName || "Unknown student"}</span>
          </div>
          {owner && (
            <div className="flex items-center gap-3">
              <LucideUniversity className="text-blue-500" size={16} />
              <span>{university}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <MapPin className="text-blue-500" size={16} />
            <span>{item?.location || "No location"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Palette className="text-blue-500" size={16} />
            <span>{item?.color || "No color"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-blue-500" size={16} />
            <span>
              {isLost
                ? formatDate((item as ExtendedLostItem)?.lostDate)
                : formatDate((item as ExtendedFoundItem)?.foundDate)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDetails(true)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-linear-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:text-blue-300 dark:hover:border-transparent dark:hover:text-white"
        >
          View Details
          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>

      {showDetails && (
        <ItemDetailsModal
          type={type}
          item={item}
          student={student}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}

export default ItemCard;
