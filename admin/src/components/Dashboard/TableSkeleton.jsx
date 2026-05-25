function TableSkeleton({ title, subtitle, columns }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-zinc-700 dark:text-gray-400">
            {columns.map((column) => (
              <th key={column} className="px-5 py-4">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No data loaded yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default TableSkeleton;



