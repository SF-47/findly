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
import { createPortal } from "react-dom";
import { isOwner } from "../../../utils/auth";

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-blue-500">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : "N/A";
}

function ItemDetailsModal({ type, item, student, onClose }) {
  if (!item) return null;

  const isLost = type === "lost";
  const owner = isOwner();
  const reportDate = isLost ? item.lostDate : item.foundDate;
  const status = item.status || "Open";
  const university =
    [student?.universityShortName, student?.universityBranch]
      .filter(Boolean)
      .join(" - ") || "N/A";

  const styles = isLost
    ? {
        accent: "from-blue-500 via-indigo-500 to-red-500",
        badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        icon: <PackageOpen />,
        label: "Lost Item Details",
      }
    : {
        accent: "from-blue-500 via-indigo-500 to-emerald-500",
        badge:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
        icon: <ClipboardCheck />,
        label: "Found Item Details",
      };

  return createPortal(
    <div className="admin-modal-overlay fixed inset-y-0 right-0 z-70 flex items-start justify-center overflow-y-auto bg-black/45 px-4 py-6 backdrop-blur-sm md:items-center">
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className={`bg-linear-to-r ${styles.accent} px-5 py-4 text-white`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                {styles.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80">
                  {styles.label}
                </p>
                <h2 className="text-xl font-bold">
                  {item.itemName || "Untitled Item"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25"
            >
              <X />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete report information
            </p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
            >
              {status}
            </span>
          </div>

          {item.imageUrl && (
            <a href={item.imageUrl} target="_blank" rel="noreferrer">
              <img
                src={item.imageUrl}
                alt={item.itemName}
                className="mx-auto mt-4 h-40 w-full max-w-md rounded-xl border border-gray-200 object-contain dark:border-zinc-700"
              />
            </a>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailRow
              icon={<User size={18} />}
              label="Student"
              value={student?.fullName || item.studentName}
            />
            {owner && (
              <DetailRow
                icon={<LucideUniversity size={18} />}
                label="University"
                value={university}
              />
            )}
            <DetailRow
              icon={<Tag size={18} />}
              label="Category"
              value={item.categoryName}
            />
            <DetailRow
              icon={<Palette size={18} />}
              label="Color"
              value={item.color}
            />
            <DetailRow
              icon={<MapPin size={18} />}
              label="Location"
              value={item.location}
            />
            <DetailRow
              icon={<Calendar size={18} />}
              label={isLost ? "Lost Date" : "Found Date"}
              value={formatDate(reportDate)}
            />
            <DetailRow
              icon={<Clock size={18} />}
              label="Reported At"
              value={formatDate(item.createdAt)}
            />
          </div>

          <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Description
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
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
