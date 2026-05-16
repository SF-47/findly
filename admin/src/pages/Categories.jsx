import CatCard from "../components/Categories/CatCard";
import { FaFilter, FaPlus } from "react-icons/fa";
import { useState } from "react";
import CategoryFilter from "../components/Categories/CatFilters";

function Categories() {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Manage item categories used for lost and found reports.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <FaFilter />
              Filter
            </button>

            {showFilters && (
              <CategoryFilter onClose={() => setShowFilters(false)} />
            )}
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700">
            <FaPlus />
            Add Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CatCard />
        <CatCard />
        <CatCard />
        <CatCard />
        <CatCard />
        <CatCard />
        <CatCard />
        <CatCard />
      </div>
    </div>
  );
}

export default Categories;
