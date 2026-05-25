import CatCard from "../components/Categories/CatCard";
import { Plus, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import CategoryFilter from "../components/Categories/CatFilters";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";

function CategorySkeletonCard() {
  return (
    <div className="w-full animate-pulse rounded-3xl border border-blue-100 bg-linear-to-br from-white via-slate-50 to-blue-50 p-6 shadow-md dark:border-zinc-700 dark:bg-none dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="h-14 w-14 rounded-2xl bg-gray-300 dark:bg-zinc-700" />
        <div className="h-8 w-8 rounded-lg bg-gray-300 dark:bg-zinc-700" />
      </div>

      <div className="mt-7 space-y-3">
        <div className="h-6 w-2/3 rounded bg-gray-300 dark:bg-zinc-700" />
        <div className="h-4 w-full rounded bg-gray-300 dark:bg-zinc-700" />
        <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-zinc-700" />
      </div>

      <div className="mt-5 h-7 w-28 rounded-full bg-gray-300 dark:bg-zinc-700" />

      <div className="mt-7 h-12 w-full rounded-2xl bg-gray-300 dark:bg-zinc-700" />
    </div>
  );
}

function Categories() {
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData() {
    try {
      setIsLoading(true);

      const response = await axiosClient.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

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
              <SlidersHorizontal />
              Filter
            </button>

            {showFilters && (
              <CategoryFilter onClose={() => setShowFilters(false)} />
            )}
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700">
            <Plus />
            Add Category
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CategorySkeletonCard key={index} />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {categories.map((c) => (
            <CatCard key={c.id} category={c} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            No categories found
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Add your first category to organize lost and found reports.
          </p>
        </div>
      )}
    </div>
  );
}

export default Categories;

