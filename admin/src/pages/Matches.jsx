import { CircleCheck, CircleX, Plus, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import MatchCard from "../components/Matches/MatchCard";
import MatchStatsCard from "../components/Matches/MatchStatsCard";
import { useState } from "react";
import MatchesFilter from "../components/Matches/MatchesFilters";

function Matches() {
  const [showFilters, setShowFilters] = useState(false);
  const stats = [
    {
      title: "Total Matches",
      subtitle: "Generated",
      value: "--",
      icon: <Search />,
      bgColor: "bg-purple-500",
    },
    {
      title: "Pending Matches",
      subtitle: "Review",
      value: "--",
      icon: <RefreshCw />,
      bgColor: "bg-yellow-500",
    },
    {
      title: "Confirmed",
      subtitle: "Accepted",
      value: "--",
      icon: <CircleCheck />,
      bgColor: "bg-green-500",
    },
    {
      title: "Rejected",
      subtitle: "Closed",
      value: "--",
      icon: <CircleX />,
      bgColor: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Matches
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
            Review possible matches between lost and found item reports.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <SlidersHorizontal />
              Filter
            </button>

            {showFilters && (
              <MatchesFilter onClose={() => setShowFilters(false)} />
            )}
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-purple-600 hover:to-indigo-700">
            <Plus />
            Generate Matches
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MatchStatsCard
            key={stat.title}
            title={stat.title}
            subtitle={stat.subtitle}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Possible Matches
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Match cards will be filled later from the backend.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search matches..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MatchCard />
        <MatchCard />
      </div>
    </div>
  );
}

export default Matches;





