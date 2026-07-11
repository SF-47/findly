import { useState, useEffect } from "react";
import CatCard from "../components/Categories/CatCard";
import { Plus } from "lucide-react";
import { getCategories, deleteCategory } from "../services/categoryService";
import { getLostItems, getFoundItems } from "../services/itemService";
import toast from "react-hot-toast";
import { isOwner } from "../../utils/auth";
import EditCategoryModal from "../components/Categories/EditCategoryModal";
//! TS CHANGE : Imported the Category interface for compile-time shape validation
import { Category } from "../types";

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
  //! TS CHANGE : Typed the state arrays and primitives using Generics
  const [categories, setCategories] = useState<Category[]>([]);
  //! TS CHANGE : Record<number, number> represents an object where keys are numbers (category IDs) and values are numbers (report counts)
  const [reportCounts, setReportCounts] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //! TS CHANGE : Union type allowing Category object or null for adding a new category
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const owner = isOwner();

  async function fetchData() {
    try {
      setIsLoading(true);

      const [categoryData, lostItemsData, foundItemsData] =
        await Promise.all([
          getCategories(),
          getLostItems(),
          getFoundItems(),
        ]);

      //! TS CHANGE : Explicitly typed the counts accumulator object to avoid implicit any errors
      const counts: Record<number, number> = {};
      [...lostItemsData, ...foundItemsData].forEach((item) => {
        counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
      });

      setCategories(categoryData);
      setReportCounts(counts);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  //! TS CHANGE : Typed the category parameter
  function handleEditCategory(category: Category) {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  }

  //! TS CHANGE : Typed the category ID parameter as a number matching Category.id (int in C#)
  async function handleDeleteCategory(id: number) {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully.");
      await fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete category.");
    }
  }

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
          {owner && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setShowCategoryModal(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700"
            >
              <Plus />
              Add Category
            </button>
          )}
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
            <CatCard
              key={c.id}
              category={c}
              reportCount={reportCounts[c.id] || 0}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
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

      {showCategoryModal && (
        <EditCategoryModal
          key={selectedCategory?.id || "new"}
          isOpen
          category={selectedCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setSelectedCategory(null);
          }}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

export default Categories;
