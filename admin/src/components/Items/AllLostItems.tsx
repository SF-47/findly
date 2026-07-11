import React from "react";
import ItemCard from "./ItemCard";
import { ArrowLeft, PackageOpen, SlidersHorizontal } from "lucide-react";
import LostItemsFilter from "./LostItemsFilters";
import { Category, ExtendedLostItem, ExtendedStudent } from "../../types";

interface AllLostItemsProps {
  lostItems: ExtendedLostItem[];
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
  setFilters: (filters: AllLostItemsProps["filters"]) => void;
  categories: Category[];
  clearFilters: () => void;
}

function AllLostItems({
  lostItems,
  students,
  onDelete,
  onBack,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  categories,
  clearFilters,
}: AllLostItemsProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex justify-between space-x-5">
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lost Items
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
              View and manage all lost item reports submitted by students.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            <PackageOpen size={18} />
            {lostItems.length} Reports
          </div>
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <SlidersHorizontal />
              Filter
            </button>
            {showFilters && (
              <LostItemsFilter
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

      {lostItems.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            No lost items found
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Lost item reports will appear here once students submit them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lostItems.map((item) => (
            <ItemCard
              key={item.id}
              type="lost"
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

export default AllLostItems;
