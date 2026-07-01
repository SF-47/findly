function MatchCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-zinc-800" />

          <div className="h-8 w-2/3 rounded-lg bg-gray-200 dark:bg-zinc-800" />
        </div>

        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-zinc-800" />
      </div>

      <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900/30 dark:bg-purple-900/10 space-y-2">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded bg-purple-200 dark:bg-purple-900" />
          <div className="h-3 w-20 rounded bg-purple-200 dark:bg-purple-900" />
        </div>
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-zinc-800" />
        <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-zinc-800" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4 dark:border-red-900/20 dark:bg-red-950/10 space-y-2">
          <div className="h-3 w-16 rounded bg-red-200 dark:bg-red-900/40" />
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-3.5 w-5/6 rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-zinc-800" />
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-900/20 dark:bg-emerald-950/10 space-y-2">
          <div className="h-3 w-16 rounded bg-emerald-200 dark:bg-emerald-900/40" />
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-3.5 w-5/6 rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-zinc-800" />
        </div>
      </div>

      <div className="mt-auto pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-5 w-12 rounded bg-gray-200 dark:bg-zinc-800" />
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-zinc-800" />

        <div className="mt-6 flex gap-3 pt-3">
          <div className="h-11 flex-1 rounded-xl bg-gray-200 dark:bg-zinc-800" />
          <div className="h-11 flex-1 rounded-xl bg-gray-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export default MatchCardSkeleton;
