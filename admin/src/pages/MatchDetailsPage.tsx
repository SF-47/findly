import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CircleCheck,
  CircleX,
  ClipboardCheck,
  PackageOpen,
  RefreshCw,
  Sparkles,
  // Dynamic Icons
  FileText,
  Smartphone,
  Key,
  Wallet,
  Shirt,
} from "lucide-react";
import { getMatches, updateMatchStatus } from "../services/matchService";
import { ItemsMatch, LostItem, FoundItem } from "../types";
import toast from "react-hot-toast";

interface DetailRowProps {
  label: string;
  value?: string | null;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="min-w-0 bg-white/70 dark:bg-zinc-900/80 p-3.5 rounded-2xl shadow-xs">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-gray-800 dark:text-gray-200 whitespace-normal break-words" title={value || ""}>
        {value || "N/A"}
      </p>
    </div>
  );
}

function getUniversityLabel(item: any, useFullName = false): string {
  const name = useFullName
    ? item.universityFullName || item.universityShortName
    : item.universityShortName || item.universityFullName;

  return [name, item.universityBranch].filter(Boolean).join(" - ") || "N/A";
}

function getCategoryIcon(categoryName?: string | null, isLost = true) {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("document") || name.includes("card") || name.includes("stationery") || name.includes("id")) {
    return <FileText size={18} />;
  }
  if (name.includes("electronic") || name.includes("phone") || name.includes("laptop") || name.includes("mobile")) {
    return <Smartphone size={18} />;
  }
  if (name.includes("key")) {
    return <Key size={18} />;
  }
  if (name.includes("wallet") || name.includes("bag") || name.includes("purse") || name.includes("backpack")) {
    return <Wallet size={18} />;
  }
  if (name.includes("clothing") || name.includes("cloth") || name.includes("apparel") || name.includes("shirt") || name.includes("wear")) {
    return <Shirt size={18} />;
  }
  return isLost ? <PackageOpen size={18} /> : <ClipboardCheck size={18} />;
}

interface ItemDetailsProps {
  item: any;
  type: "lost" | "found";
}

function ItemDetails({ item, type }: ItemDetailsProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const isLost = type === "lost";
  const categoryIcon = getCategoryIcon(item.categoryName, isLost);
  
  const styles = isLost
    ? {
        background: "bg-red-50/50 dark:bg-red-950/25",
        badgeClass: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        icon: categoryIcon,
        iconBg: "bg-blue-600",
        title: "Lost Item Report",
      }
    : {
        background: "bg-emerald-50/50 dark:bg-emerald-950/25",
        badgeClass: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        icon: categoryIcon,
        iconBg: "bg-blue-600",
        title: "Found Item Report",
      };

  const itemDate = item.date || (isLost ? item.lostDate : item.foundDate);

  return (
    <div
      className={`rounded-3xl p-6 shadow-xs flex flex-col justify-between ${styles.background}`}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${styles.iconBg}`}
            >
              {styles.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 leading-none">
                {styles.title}
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {item.itemName || "Untitled Item"}
              </h3>
            </div>
          </div>
          {item.status && (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badgeClass}`}>
              {item.status}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {item.imageUrl ? (
            <div className="w-full md:w-40 h-40 shrink-0 relative overflow-hidden rounded-2xl">
              {imageLoading && (
                <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-zinc-800" />
              )}
              <a
                href={item.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full h-full group/img relative overflow-hidden rounded-2xl shadow-xs"
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
                  <span className="text-[11px] bg-black/70 text-white font-semibold rounded-full px-3 py-1">View Full Image</span>
                </div>
              </a>
            </div>
          ) : (
            <div className="w-full md:w-40 h-40 shrink-0 rounded-2xl bg-white/40 dark:bg-zinc-900/40 flex flex-col items-center justify-center text-gray-400 dark:text-zinc-500 shadow-xs">
              <PackageOpen size={24} className="opacity-40" />
              <span className="text-xs mt-2 font-semibold">No Image</span>
            </div>
          )}

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      <div className="mt-5 border-t border-gray-200/30 dark:border-zinc-800/30 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Description
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-normal break-words" title={item.description}>
          {item.description || "No description available."}
        </p>
      </div>
    </div>
  );
}

export default function MatchDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  useEffect(() => {
    async function loadMatchDetails() {
      try {
        setIsLoading(true);
        const data = await getMatches();
        const foundMatch = data.find((m) => m.id === id);
        if (!foundMatch) {
          toast.error("Match not found.");
          navigate("/matches");
          return;
        }
        setMatch(foundMatch);
      } catch (error) {
        console.error("Failed to load match details:", error);
        toast.error("Error loading match details.");
        navigate("/matches");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadMatchDetails();
    }
  }, [id, navigate]);

  async function handleStatusChange(status: string) {
    if (!match) return;
    try {
      setIsUpdating(true);
      setActiveAction(status);
      const data = await updateMatchStatus(match.id, status);
      setMatch((prev: any) =>
        prev
          ? {
              ...prev,
              status: data.status,
              reviewedAt: data.reviewedAt,
            }
          : null
      );
      toast.success(`Match ${status.toLowerCase()} successfully.`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${status.toLowerCase()} match.`);
    } finally {
      setIsUpdating(false);
      setActiveAction(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!match) return null;

  const percentage = Math.min(Math.max(match.matchPercentage, 0), 100);
  const normalizedStatus = match.status?.toLowerCase();
  
  const statusClass =
    normalizedStatus === "confirmed"
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      : normalizedStatus === "rejected"
        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

  return (
    <div className="space-y-6">
      {/* Top Navigation Row */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/matches")}
          className="rounded-xl border border-gray-200 bg-white p-3 text-gray-600 shadow-xs transition hover:bg-gray-100 hover:text-gray-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            AI Match Analysis
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Match Comparison Report
          </h1>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Accuracy Score */}
        <div className="md:col-span-1 flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
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
          <div className="my-5 flex items-baseline gap-2">
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
        <div className="md:col-span-2 rounded-3xl border border-gray-200/50 bg-purple-50/40 dark:border-zinc-800 dark:bg-purple-900/10 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                AI Recommendation & Reasoning
              </span>
            </div>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
              {match.reasoningSummary || "No reasoning summary available."}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-purple-600/70 dark:text-purple-400/70 border-t border-purple-100/40 dark:border-purple-900/20 pt-3">
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

      {/* Footer Actions */}
      <div className="rounded-3xl border border-gray-200 bg-white px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Resolution Status:
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${statusClass}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {match.status} Match
          </span>
        </div>

        {normalizedStatus !== "resolved" && (
          <div className="flex w-full sm:w-auto gap-3">
            <button
              type="button"
              onClick={() => handleStatusChange("Rejected")}
              disabled={isUpdating || normalizedStatus === "rejected"}
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-6 py-3 text-sm font-semibold text-red-600 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
            >
              {isUpdating && activeAction === "Rejected" ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <CircleX size={16} />
              )}
              Reject Match
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("Confirmed")}
              disabled={isUpdating || normalizedStatus === "confirmed"}
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
            >
              {isUpdating && activeAction === "Confirmed" ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <CircleCheck size={16} />
              )}
              Confirm Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
