import React from "react";
import { Search, UserCheck, X } from "lucide-react";
import PrimeDropdown from "../PrimeDropdown";

export interface FiltersState {
  search: string;
  status: string;
  percentage: string;
  createdDate: string;
}

interface MatchesFilterProps {
  filters: FiltersState;
  onChange: React.Dispatch<React.SetStateAction<FiltersState>> | ((updater: (prev: FiltersState) => FiltersState) => void);
  onClear: () => void;
  onClose: () => void;
}

function MatchesFilter({ filters, onChange, onClear, onClose }: MatchesFilterProps) {
  return (
    <div className="absolute right-0 top-14 z-50 w-96 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Filter Matches
        </h2>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <X />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Search Match
          </label>

          <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50 px-3 dark:border-zinc-700 dark:bg-zinc-800">
            <Search className="mr-2 text-gray-400" />

            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                onChange((prev: FiltersState) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Lost item, found item, student..."
              className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Match Status
          </label>

          <PrimeDropdown
            value={filters.status}
            onChange={(value) =>
              onChange((prev: FiltersState) => ({ ...prev, status: value }))
            }
            placeholder="All Matches"
            options={[
              { value: "pending", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "rejected", label: "Rejected" },
              { value: "resolved", label: "Resolved" },
            ]}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Match Percentage
          </label>

          <PrimeDropdown
            value={filters.percentage}
            onChange={(value) =>
              onChange((prev: FiltersState) => ({ ...prev, percentage: value }))
            }
            placeholder="All Percentages"
            options={[
              { value: "90", label: "90% and above" },
              { value: "75", label: "75% and above" },
              { value: "50", label: "50% and above" },
            ]}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Created Date
          </label>

          <PrimeDropdown
            value={filters.createdDate}
            onChange={(value) =>
              onChange((prev: FiltersState) => ({ ...prev, createdDate: value }))
            }
            placeholder="All Dates"
            options={[
              { value: "today", label: "Today" },
              { value: "yesterday", label: "Yesterday" },
              { value: "week", label: "Last 7 Days" },
              { value: "month", label: "Last 30 Days" },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClear}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700"
        >
          <UserCheck />
          Apply
        </button>
      </div>
    </div>
  );
}

export default MatchesFilter;
