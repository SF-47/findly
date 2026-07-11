import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  ClipboardCheck,
  Clock,
  LucideUniversity,
  MapPin,
  PackageOpen,
  Palette,
  Tag,
  User,
  X,
} from "lucide-react";
import { isOwner } from "../../../utils/auth";
import { ExtendedFoundItem, ExtendedLostItem, ExtendedStudent } from "../../types";

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      <span className="text-blue-500 mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-gray-700 dark:text-gray-200">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

function formatDate(date?: string | null) {
  return date ? new Date(date).toLocaleDateString() : "N/A";
}

interface ItemDetailsModalProps {
  type: "lost" | "found";
  item: ExtendedFoundItem | ExtendedLostItem | null;
  student?: ExtendedStudent | null;
  onClose: () => void;
}

function ItemDetailsModal({ type, item, student, onClose }: ItemDetailsModalProps) {
  const [imageLoading, setImageLoading] = useState(true);
  if (!item) return null;

  const isLost = type === "lost";
  const owner = isOwner();
  const reportDate = isLost 
    ? (item as ExtendedLostItem).lostDate 
    : (item as ExtendedFoundItem).foundDate;
  const status = item.status || "Open";
  const university =
    [student?.universityShortName, student?.universityBranch]
      .filter(Boolean)
      .join(" - ") || "N/A";

  const styles = isLost
    ? {
        accent: "from-blue-500 via-indigo-500 to-red-500",
        badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        icon: <PackageOpen size={20} />,
        label: "Lost Item Details",
      }
    : {
        accent: "from-blue-500 via-indigo-500 to-emerald-500",
        badge:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        icon: <ClipboardCheck size={20} />,
        label: "Found Item Details",
      };

  return createPortal(
    <div className="admin-modal-overlay fixed inset-y-0 right-0 z-70 flex items-start justify-center bg-black/45 px-4 py-6 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
        <div className={`bg-linear-to-r ${styles.accent} px-5 py-4 text-white`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                {styles.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-white/80 uppercase">
                  {styles.label}
                </p>
                <h2 className="text-xl font-bold leading-tight">
                  {item.itemName || "Untitled Item"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete report information
            </p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
            >
              {status}
            </span>
          </div>

          <div className="flex gap-5">
            {item.imageUrl && (
              <div className="w-40 h-40 shrink-0 relative">
                {imageLoading && (
                  <div className="absolute inset-0 animate-pulse rounded-xl bg-gray-200 dark:bg-zinc-800" />
                )}
                <a href={item.imageUrl} target="_blank" rel="noreferrer" className="block w-full h-full">
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                    className={`h-full w-full rounded-xl border border-gray-200 object-cover dark:border-zinc-700 transition-opacity duration-300 ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                </a>
              </div>
            )}

            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3">
              <DetailRow
                icon={<User size={16} />}
                label="Student"
                value={student?.fullName || item.studentName}
              />
              {owner && (
                <DetailRow
                  icon={<LucideUniversity size={16} />}
                  label="University"
                  value={university}
                />
              )}
              <DetailRow
                icon={<Tag size={16} />}
                label="Category"
                value={item.categoryName}
              />
              <DetailRow
                icon={<Palette size={16} />}
                label="Color"
                value={item.color}
              />
              <DetailRow
                icon={<MapPin size={16} />}
                label="Location"
                value={item.location}
              />
              <DetailRow
                icon={<Calendar size={16} />}
                label={isLost ? "Lost Date" : "Found Date"}
                value={formatDate(reportDate)}
              />
              <DetailRow
                icon={<Clock size={16} />}
                label="Reported At"
                value={formatDate(item.createdAt)}
              />
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200/50 dark:border-zinc-700/50 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Description
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              {item.description || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ItemDetailsModal;
