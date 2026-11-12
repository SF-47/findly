
function ItemStatsCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-xl bg-gray-300 dark:bg-zinc-700" />

        <div className="h-6 w-20 rounded-full bg-gray-300 dark:bg-zinc-700" />
      </div>

      <div className="mt-6">
        <div className="h-10 w-20 rounded bg-gray-300 dark:bg-zinc-700" />

        <div className="mt-3 h-4 w-32 rounded bg-gray-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
}

export default ItemStatsCardSkeleton;
