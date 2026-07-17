import { useState } from "react";
import { createPortal } from "react-dom";
import {
  CircleCheck,
  CircleX,
  ClipboardCheck,
  PackageOpen,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { MatchItem, MatchCardMatch } from "./MatchCard";

interface DetailRowProps {
  label: string;
  value?: string | null;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="min-w-0 bg-white/70 dark:bg-zinc-900/80 p-2.5 rounded-xl shadow-xs">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-404 dark:text-gray-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-normal break-words" title={value || ""}>
        {value || "N/A"}
      </p>
    </div>
  );
}

function getUniversityLabel(item: MatchItem, useFullName = false): string {
  const name = useFullName
    ? item.universityFullName || item.universityShortName
    : item.universityShortName || item.universityFullName;

  return [name, item.universityBranch].filter(Boolean).join(" - ") || "N/A";
}

interface ItemDetailsProps {
  item: MatchItem;
  type: "lost" | "found";
}

function ItemDetails({ item, type }: ItemDetailsProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const isLost = type === "lost";
  const styles = isLost
    ? {
        background: "bg-red-50/50 dark:bg-red-950/25",
        badgeClass: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        icon: <PackageOpen size={16} />,
        iconBg: "bg-red-500",
        title: "Lost Item Report",
      }
    : {
        background: "bg-emerald-50/50 dark:bg-emerald-950/25",
        badgeClass: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        icon: <ClipboardCheck size={16} />,
        iconBg: "bg-emerald-500",
        title: "Found Item Report",
      };

  const itemDate = item.date || (isLost ? item.lostDate : item.foundDate);

  return (
    <div
      className={`rounded-2xl p-5 shadow-xs flex flex-col justify-between ${styles.background}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${styles.iconBg}`}
            >
              {styles.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 leading-none">
                {styles.title}
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mt-1">
                {item.itemName || "Untitled Item"}
              </h3>
            </div>
          </div>
          {item.status && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles.badgeClass}`}>
              {item.status}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {item.imageUrl ? (
            <div className="w-full sm:w-32 h-32 shrink-0 relative overflow-hidden rounded-xl">
              {imageLoading && (
                <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-zinc-800" />
              )}
              <a
                href={item.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full h-full group/img relative overflow-hidden rounded-xl shadow-xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                  className={`h-full w-full object-cover transition-all duration-300 group-hover/img:scale-105 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                />
                <div className="absolute inset-0 bg-black/15 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <span className="text-[10px] bg-black/70 text-white font-semibold rounded-full px-2 py-0.5">View Large</span>
                </div>
              </a>
            </div>
          ) : (
            <div className="w-full sm:w-32 h-32 shrink-0 rounded-xl bg-white/40 dark:bg-zinc-900/40 flex flex-col items-center justify-center text-gray-400 dark:text-zinc-500 shadow-xs">
              <PackageOpen size={22} className="opacity-40" />
              <span className="text-[10px] mt-1 font-semibold">No Image</span>
            </div>
          )}

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <DetailRow label="Reporter" value={item.studentName} />
            <DetailRow
              label="University"
              value={getUniversityLabel(item, false)}
            />
            <DetailRow label="Category" value={item.categoryName} />
            <DetailRow label="Color" value={item.color} />
            <DetailRow label="Location" value={item.location} />
            <DetailRow
              label={isLost ? "Lost Date" : "Found Date"}
              value={itemDate ? new Date(itemDate).toLocaleDateString() : "N/A"}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200/30 dark:border-zinc-800/30 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Description
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300 wrap-break-words line-clamp-3 hover:line-clamp-none transition-all duration-300" title={item.description}>
          {item.description || "No description available."}
        </p>
      </div>
    </div>
  );
}

interface MatchDetailsModalProps {
  match: MatchCardMatch | null;
  onStatusChange?: (status: string) => Promise<void> | void;
  onClose: () => void;
}

function MatchDetailsModal({ match, onStatusChange, onClose }: MatchDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  if (!match) {
    return null;
  }

  const percentage = Math.min(Math.max(match.matchPercentage, 0), 100);
  const normalizedStatus = match.status?.toLowerCase();
  
  const statusClass =
    normalizedStatus === "confirmed"
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      : normalizedStatus === "rejected"
        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

  async function handleAction(status: string) {
    if (!onStatusChange) return;
    try {
      setIsUpdating(true);
      setActiveAction(status);
      await onStatusChange(status);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
      setActiveAction(null);
    }
  }

  return createPortal(
    <div
      onClick={onClose}
      className="admin-modal-overlay fixed inset-0 z-70 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden md:max-h-[calc(100vh-4rem)]"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                <Sparkles className="h-5 w-5 animate-pulse text-purple-200" />
              </div>
              <div>
                <p className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
                  AI Match Analysis
                </p>
                <h2 className="text-xl font-bold leading-tight">
                  Match Comparison Report
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/10 p-2.5 text-white transition hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-gray-50/40 dark:bg-zinc-950/40">
          {/* Overview Block */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Accuracy Score */}
            <div className="md:col-span-1 flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Match Accuracy
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    percentage >= 80
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : percentage >= 50
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {match.confidenceLevel}
                </span>
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {percentage}%
                </span>
                <span className="text-xs text-gray-500">similarity score</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="md:col-span-2 rounded-2xl bg-purple-50/60 dark:bg-purple-900/10 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    AI Recommendation & Reasoning
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {match.reasoningSummary || "No reasoning summary available."}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-purple-600/70 dark:text-purple-400/70 border-t border-purple-100/40 dark:border-purple-900/20 pt-2">
                <span>
                  Status: <strong className="capitalize">{match.status}</strong>
                </span>
                {match.reviewedAt && (
                  <span>
                    Reviewed: {new Date(match.reviewedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ItemDetails item={match.lostItem} type="lost" />
            <ItemDetails item={match.foundItem} type="found" />
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Resolution:
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {match.status} Match
            </span>
          </div>

          {onStatusChange && (
            <div className="flex w-full sm:w-auto gap-3">
              <button
                type="button"
                onClick={() => handleAction("Rejected")}
                disabled={isUpdating || normalizedStatus === "rejected"}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                {isUpdating && activeAction === "Rejected" ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <CircleX size={15} />
                )}
                Reject Match
              </button>
              <button
                type="button"
                onClick={() => handleAction("Confirmed")}
                disabled={isUpdating || normalizedStatus === "confirmed"}
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                {isUpdating && activeAction === "Confirmed" ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <CircleCheck size={15} />
                )}
                Confirm Match
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default MatchDetailsModal;
