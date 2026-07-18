import React, { useState } from "react";
import { ArrowLeft, CircleCheck, CircleX, MoreVertical, RefreshCw, SlidersHorizontal, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MatchesFilter from "./MatchesFilters";
import ConfirmDialog from "../ConfirmDialog";

interface AllMatchesProps {
  matches: any[];
  onStatusChange: (id: string, status: string) => Promise<void> | void;
  onDelete: (id: string) => void;
  onRefresh?: () => Promise<void> | void;
  isLoading?: boolean;
  onBack: () => void;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  filters: {
    search: string;
    status: string;
    percentage: string;
    createdDate: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<AllMatchesProps["filters"]>>;
  clearFilters: () => void;
}

function CompactMatchCard({ match, onStatusChange, onDelete }: { 
  match: any; 
  onStatusChange: AllMatchesProps["onStatusChange"];
  onDelete: AllMatchesProps["onDelete"];
}) {
  const navigate = useNavigate();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const percentage = Math.min(Math.max(match.matchPercentage, 0), 100);
  const normalizedStatus = match.status?.toLowerCase();
  
  const statusColors = normalizedStatus === "confirmed" 
    ? { text: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/20" }
    : normalizedStatus === "rejected"
    ? { text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20" }
    : { text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/20" };

  const [showMenu, setShowMenu] = useState(false);

  async function handleStatusChange(status: string) {
    try {
      setIsUpdatingStatus(true);
      await onStatusChange(match.id, status);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <div 
      onClick={() => navigate(`/matches/${match.id}`)}
      className="group relative rounded-2xl border border-gray-250 bg-white px-6 py-7 min-h-[270px] flex flex-col justify-between shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between text-sm">
        <span className={`rounded-full px-3 py-0.5 font-semibold text-xs ${statusColors.bg} ${statusColors.text}`}>
          {match.status} Match
        </span>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-500 dark:text-zinc-400 flex items-center gap-1">
            <Sparkles size={14} className="text-blue-500" />
            {match.confidenceLevel}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
            >
              <MoreVertical size={14} />
            </button>
            {showMenu && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-8 z-50 w-32 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
              >
                <ConfirmDialog
                  title="Delete match?"
                  description="Are you sure you want to delete this match?"
                  onConfirm={() => {
                    setShowMenu(false);
                    onDelete(match.id);
                  }}
                  onCancel={() => setShowMenu(false)}
                >
                  <button 
                    type="button" 
                    onClick={(e) => e.stopPropagation()}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-650 dark:text-red-400 dark:hover:bg-red-950/40 cursor-pointer"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </ConfirmDialog>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3-Column Comparison Layout (Lost -> Match % -> Found) */}
      <div className="my-5 grid grid-cols-[1.3fr_0.8fr_1.3fr] items-center gap-2 text-center">
        {/* Column 1: Lost Item Details & Thumbnail */}
        <div className="flex items-center gap-2.5 text-left min-w-0">
          {match.lostItem.imageUrl ? (
            <img
              src={match.lostItem.imageUrl}
              alt="Lost Thumbnail"
              className="h-16 w-16 shrink-0 rounded-2xl object-cover border border-gray-150 dark:border-zinc-800"
            />
          ) : (
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 text-[10px] font-bold text-gray-400">
              N/A
            </div>
          )}
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-red-500">Lost</span>
            <h4 className="text-sm font-bold text-gray-800 dark:text-white break-words" title={match.lostItem.itemName}>
              {match.lostItem.itemName}
            </h4>
            <p className="text-xs text-gray-550 dark:text-gray-450 break-words">
              {match.lostItem.studentName}
            </p>
          </div>
        </div>

        {/* Column 2: Match Percentage Circle */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm shadow-inner dark:bg-blue-950/20 dark:text-blue-400">
            <span>{percentage}%</span>
          </div>
          <span className="mt-2 text-[10px] font-bold tracking-wider text-gray-400 dark:text-zinc-550">SIMILARITY</span>
        </div>

        {/* Column 3: Found Item Details & Thumbnail */}
        <div className="flex items-center justify-end gap-2.5 text-right min-w-0">
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-green-500">Found</span>
            <h4 className="text-sm font-bold text-gray-800 dark:text-white break-words" title={match.foundItem.itemName}>
              {match.foundItem.itemName}
            </h4>
            <p className="text-xs text-gray-555 dark:text-gray-450 break-words">
              {match.foundItem.studentName}
            </p>
          </div>
          {match.foundItem.imageUrl ? (
            <img
              src={match.foundItem.imageUrl}
              alt="Found Thumbnail"
              className="h-16 w-16 shrink-0 rounded-2xl object-cover border border-gray-150 dark:border-zinc-800"
            />
          ) : (
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 text-[10px] font-bold text-gray-400">
              N/A
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-150 dark:bg-zinc-800" />

      {/* Actions Footer */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/matches/${match.id}`);
          }}
          className="flex items-center gap-1.5 text-sm font-bold text-blue-650 hover:text-blue-750 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
        >
          View Details <span className="transition-transform group-hover:translate-x-1.5 font-semibold">→</span>
        </button>
      </div>
    </div>
  );
}

function AllMatches({
  matches,
  onStatusChange,
  onDelete,
  onRefresh,
  isLoading,
  onBack,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  clearFilters,
}: AllMatchesProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex justify-between space-x-5">
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              All Possible Matches
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
              Review and manage all AI-calculated lost and found item matching recommendations.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex w-fit cursor-pointer items-center gap-3 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg duration-300 hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 text-sm"
              title="Refresh Matches"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          )}
          <div className="flex w-fit items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/20 dark:text-purple-300">
            <Sparkles size={18} className="text-purple-500" />
            {matches.length} Matches
          </div>
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <SlidersHorizontal />
              Filter
            </button>
            {showFilters && (
              <MatchesFilter
                filters={filters}
                onChange={setFilters as any}
                onClear={clearFilters}
                onClose={() => setShowFilters(false)}
              />
            )}
          </div>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            No matches found
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No matches meet the current filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {matches.map((match) => (
            <CompactMatchCard
              key={match.id}
              match={match}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllMatches;
