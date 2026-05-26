
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ page, totalItems, rowsPerPage, setPage }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  function handlePageChange(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
        Page{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {page}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalPages}
        </span>
      </p>

      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="w-10 h-10 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ChevronLeft size={14} />
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
          className="w-10 h-10 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;




