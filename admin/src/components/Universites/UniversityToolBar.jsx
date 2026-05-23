import { FaSearch } from "react-icons/fa";

function UniversitiesToolbar({ search, setSearch }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Universities List
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            University records and branches will appear here.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-400  dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default UniversitiesToolbar;