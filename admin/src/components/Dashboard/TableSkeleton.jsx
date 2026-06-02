function TableSkeleton({
  title,
  subtitle,
  columns,
  data = [],
  type,
  isLoading = false,
}) {
  function formatDate(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  }

  function renderRow(item) {
    if (type === "lost") {
      return (
        <>
          <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
            {item.itemName || "Untitled"}
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {item.universityShortName + " ("+ item.universityBranch + ")" || "N/A"}
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {item.studentName || "N/A"}
          </td>
          <td className="px-5 py-4">
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
              {item.status || "Open"}
            </span>
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {formatDate(item.lostDate)}
          </td>
        </>
      );
    }

    if (type === "found") {
      return (
        <>
          <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
            {item.itemName || "Untitled"}
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {item.categoryName || "N/A"}
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {item.studentName || "N/A"}
          </td>
          <td className="px-5 py-4">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {item.status || "Open"}
            </span>
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {formatDate(item.foundDate)}
          </td>
        </>
      );
    }

    if (type === "students") {
      return (
        <>
          <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
            {item.fullName || "Unnamed student"}
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {item.universityStudentId || "N/A"}
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {item.phoneNumber || "N/A"}
          </td>
          <td className="px-5 py-4">
            {item.isVerified ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                Verified
              </span>
            ) : (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                Pending
              </span>
            )}
          </td>
        </>
      );
    }

    if (type === "matches") {
      return (
        <>
          <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
            {item.lostItem?.itemName || "Untitled"}
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {item.foundItem?.itemName || "Untitled"}
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {item.matchPercentage ?? 0}%
          </td>
          <td className="px-5 py-4">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              {item.status || "Pending"}
            </span>
          </td>
          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
            {formatDate(item.createdAt)}
          </td>
        </>
      );
    }

    return (
      <td
        colSpan={columns.length}
        className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400"
      >
        Unsupported table type.
      </td>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-sm backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-900/90">
      <div className="border-b border-gray-200/80 px-5 py-4 dark:border-zinc-700/80">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200/80 bg-white/45 text-left text-xs uppercase text-gray-500 dark:border-zinc-700/80 dark:bg-zinc-950/20 dark:text-gray-400">
              {columns.map((column) => (
                <th key={column} className="px-5 py-4">
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr
                  key={index}
                  className="animate-pulse border-b border-gray-200/80 dark:border-zinc-700/80"
                >
                  {columns.map((column) => (
                    <td key={column} className="px-5 py-4">
                      <div className="h-4 w-24 rounded bg-gray-300 dark:bg-zinc-700" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No data loaded yet.
                </td>
              </tr>
            ) : (
              data.slice(0, 3).map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200/80 text-sm transition hover:bg-gray-50 dark:border-zinc-700/80 dark:hover:bg-zinc-800"
                >
                  {renderRow(item)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableSkeleton;
