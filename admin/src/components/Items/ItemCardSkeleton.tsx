
function ItemCardSkeleton() {
  return (
    <div className="w-full animate-pulse overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 p-5 dark:border-zinc-700 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/40 dark:bg-zinc-600" />

            <div>
              <div className="mt-3 h-6 w-40 rounded bg-white/50 dark:bg-zinc-600" />
            </div>
          </div>

          <div className="h-8 w-8 rounded-lg bg-white/40 dark:bg-zinc-600" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="h-4 w-28 rounded bg-gray-300 dark:bg-zinc-700" />

            <div className="mt-3 space-y-2">
              <div className="h-4 w-full rounded bg-gray-300 dark:bg-zinc-700" />
              <div className="h-4 w-4/5 rounded bg-gray-300 dark:bg-zinc-700" />
            </div>
          </div>

          <div className="h-6 w-16 rounded-full bg-gray-300 dark:bg-zinc-700" />
        </div>

        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-gray-300 dark:bg-zinc-700" />
              <div className="h-4 w-36 rounded bg-gray-300 dark:bg-zinc-700" />
            </div>
          ))}
        </div>

        <div className="mt-6 h-12 w-full rounded-2xl bg-gray-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
}

export default ItemCardSkeleton;
