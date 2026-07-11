import React from "react";
import { ArrowLeft, ClipboardCheck, SlidersHorizontal } from "lucide-react";
import ItemCard from "./ItemCard";
import FoundItemsFilter from "./FoundItemsFilters";
import { Category, ExtendedFoundItem, ExtendedStudent } from "../../types";

interface AllFoundItemsProps {
  foundItems: ExtendedFoundItem[];
  students: ExtendedStudent[];
  onDelete?: (id: string) => void;
  onBack?: () => void;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  filters: {
    search: string;
    category: string | number | null | undefined;
    status: string | null | undefined;
    date: string | null | undefined;
  };
  setFilters: (filters: AllFoundItemsProps["filters"]) => void;
  categories: Category[];
  clearFilters: () => void;
}

function AllFoundItems({
  foundItems,
  students,
  onDelete,
  onBack,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  categories,
  clearFilters,
}: AllFoundItemsProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              All Found Items
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
              View and manage all found item reports submitted by students.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
            <ClipboardCheck size={18} />
            {foundItems.length} Reports
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <SlidersHorizontal />
              Filter
            </button>

            {showFilters && (
              <FoundItemsFilter
                filters={filters}
                categories={categories}
                onChange={setFilters}
                onClear={clearFilters}
                onClose={() => setShowFilters(false)}
              />
            )}
          </div>
        </div>
      </div>

      {foundItems.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            No found items found
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Found item reports will appear here once students submit them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {foundItems.map((item) => (
            <ItemCard
              key={item.id}
              type="found"
              item={item}
              students={students}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllFoundItems;
