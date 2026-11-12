
function DashCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-900/90">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-xl bg-gray-300 dark:bg-zinc-700"></div>
      </div>

      <div className="mt-6">
        <div className="h-9 w-20 rounded bg-gray-300 dark:bg-zinc-700"></div>
        <div className="mt-3 h-4 w-32 rounded bg-gray-300 dark:bg-zinc-700"></div>
      </div>
    </div>
  );
}

export default DashCardSkeleton;
