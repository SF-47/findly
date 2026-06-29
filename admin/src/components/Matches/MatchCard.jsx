import {
  CircleCheck,
  CircleX,
  ClipboardCheck,
  Eye,
  LucideUniversity,
  MoreVertical,
  PackageOpen,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "../ConfirmDialog";
import MatchDetailsModal from "./MatchDetailsModal";

function getUniversityLabel(item) {
  const name = item.universityShortName || item.universityFullName;

  return [name, item.universityBranch].filter(Boolean).join(" - ") || "N/A";
}

function MatchCard({ match, onStatusChange, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const percentage = Math.min(Math.max(match.matchPercentage, 0), 100);
  const normalizedStatus = match.status?.toLowerCase();
  const statusClass =
    normalizedStatus === "confirmed"
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      : normalizedStatus === "rejected"
        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

  async function handleStatusChange(status) {
    try {
      setIsUpdatingStatus(true);
      await onStatusChange(match.id, status);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <>
      <div className="group flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
            >
              {match.status} Match
            </span>

            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              {match.confidenceLevel} Confidence
            </h2>

            <p className="mt-1 min-h-20 line-clamp-4 text-sm leading-5 text-gray-500 dark:text-gray-400">
              {match.reasoningSummary ||
                "Lost and found item similarity result."}
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
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowDetailsModal(true);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-700"
                >
                  <Eye size={13} />
                  View
                </button>

                <ConfirmDialog
                  title="Delete match?"
                  description="Are you sure you want to delete this match? This action cannot be undone."
                  onConfirm={() => {
                    setShowMenu(false);
                    onDelete(match.id);
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
                  {match.lostItem.itemName}
                </h3>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {match.lostItem.categoryName} | {match.lostItem.color} |{" "}
              {match.lostItem.location}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <LucideUniversity size={16} />
              {getUniversityLabel(match.lostItem)}
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
                  {match.foundItem.itemName}
                </h3>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {match.foundItem.categoryName} | {match.foundItem.color} |{" "}
              {match.foundItem.location}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <LucideUniversity size={16} />
              {getUniversityLabel(match.foundItem)}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Match Percentage
              </p>

              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {percentage}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-linear-to-r from-purple-500 to-indigo-600"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => handleStatusChange("Confirmed")}
              disabled={isUpdatingStatus || normalizedStatus === "confirmed"}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CircleCheck />
              Confirm
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange("Rejected")}
              disabled={isUpdatingStatus || normalizedStatus === "rejected"}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CircleX />
              Reject
            </button>
          </div>
        </div>
      </div>

      {showDetailsModal && (
        <MatchDetailsModal
          match={match}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
}

export default MatchCard;
