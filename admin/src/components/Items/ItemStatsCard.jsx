function ItemStatsCard({ title, subtitle, value, icon, bgColor }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white shadow-md ${bgColor}`}
        >
          {icon}
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
          {subtitle}
        </span>
      </div>

      <div className="mt-6">
        <h2 className="text-4xl font-bold tracking-tight">{value}</h2>

        <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </p>
      </div>
    </div>
  );
}

export default ItemStatsCard;


