import {
  CircleCheck,
  CircleX,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getMatches,
  updateMatchStatus,
  deleteMatch,
} from "../services/matchService";
import MatchCard from "../components/Matches/MatchCard";
import MatchCardSkeleton from "../components/Matches/MatchCardSkeleton";
import MatchesFilter from "../components/Matches/MatchesFilters";
import MatchStatsCard from "../components/Matches/MatchStatsCard";
import AllMatches from "../components/Matches/AllMatches";
//! TS CHANGE : Imported core types for items matches and components
import { ItemsMatch, LostItem, FoundItem } from "../types";

interface ExtendedLostItem extends LostItem {
  categoryName?: string;
  studentName?: string;
}

interface ExtendedFoundItem extends FoundItem {
  categoryName?: string;
  studentName?: string;
}

//! TS CHANGE : Used Omit<> to pick all items from ItemsMatch except 'lostItem' and 'foundItem', replacing them with their Extended types
interface ExtendedItemsMatch extends Omit<
  ItemsMatch,
  "lostItem" | "foundItem"
> {
  lostItem: ExtendedLostItem;
  foundItem: ExtendedFoundItem;
}

function Matches() {
  //! TS CHANGE : Enforce state structure to match ExtendedItemsMatch array
  const [matches, setMatches] = useState<ExtendedItemsMatch[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAllMatches, setShowAllMatches] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    percentage: "",
    createdDate: "",
  });

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      //! TS CHANGE : Cast return array to ExtendedItemsMatch[] since basic getMatches doesn't declare the custom extended UI fields natively
      const data = (await getMatches()) as ExtendedItemsMatch[];
      setMatches(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load matches.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const search = filters.search.trim().toLowerCase();
      const createdDate = new Date(match.createdAt);
      const now = new Date();
      const daysDiff =
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

      const matchesSearch =
        !search ||
        match.lostItem.itemName?.toLowerCase().includes(search) ||
        match.foundItem.itemName?.toLowerCase().includes(search) ||
        match.lostItem.categoryName?.toLowerCase().includes(search) ||
        match.foundItem.categoryName?.toLowerCase().includes(search) ||
        match.lostItem.location?.toLowerCase().includes(search) ||
        match.foundItem.location?.toLowerCase().includes(search) ||
        match.lostItem.studentName?.toLowerCase().includes(search) ||
        match.foundItem.studentName?.toLowerCase().includes(search);

      const matchesStatus =
        !filters.status || match.status?.toLowerCase() === filters.status;
      const matchesPercentage =
        !filters.percentage ||
        match.matchPercentage >= Number(filters.percentage);
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);

      const matchesDate =
        !filters.createdDate ||
        (filters.createdDate === "today" &&
          createdDate.toDateString() === now.toDateString()) ||
        (filters.createdDate === "yesterday" &&
          createdDate.toDateString() === yesterday.toDateString()) ||
        (filters.createdDate === "week" && daysDiff <= 7) ||
        (filters.createdDate === "month" && daysDiff <= 31);

      return matchesSearch && matchesStatus && matchesPercentage && matchesDate;
    });
  }, [filters, matches]);

  const sortedMatches = useMemo(() => {
    return [...filteredMatches].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [filteredMatches]);

  function clearFilters() {
    setFilters({
      search: "",
      status: "",
      percentage: "",
      createdDate: "",
    });
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      const data = await updateMatchStatus(id, status);

      setMatches((prev) =>
        prev.map((match) =>
          match.id === id
            ? {
                ...match,
                status: data.status,
                reviewedAt: data.reviewedAt,
              }
            : match,
        ),
      );

      toast.success(`Match ${status.toLowerCase()} successfully.`);
    } catch (error) {
      console.log(error);
      toast.error(`Failed to ${status.toLowerCase()} match.`);
    }
  }

  async function handleDeleteMatch(id: string) {
    try {
      await deleteMatch(id);
      setMatches((prev) => prev.filter((match) => match.id !== id));
      toast.success("Match deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete match.");
    }
  }

  const countByStatus = (status: string) =>
    matches.filter((match) => match.status?.toLowerCase() === status).length;

  const stats = [
    {
      title: "Total Matches",
      subtitle: "Generated",
      value: matches.length,
      icon: <Search />,
      bgColor: "bg-blue-600",
    },
    {
      title: "Pending Matches",
      subtitle: "Review",
      value: countByStatus("pending"),
      icon: <RefreshCw />,
      bgColor: "bg-blue-600",
    },
    {
      title: "Confirmed",
      subtitle: "Accepted",
      value: countByStatus("confirmed"),
      icon: <CircleCheck />,
      bgColor: "bg-blue-600",
    },
    {
      title: "Rejected",
      subtitle: "Closed",
      value: countByStatus("rejected"),
      icon: <CircleX />,
      bgColor: "bg-blue-600",
    },
  ];

  if (showAllMatches) {
    return (
      <AllMatches
        matches={sortedMatches}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteMatch}
        onRefresh={fetchMatches}
        isLoading={isLoading}
        onBack={() => {
          setShowAllMatches(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters as any}
        clearFilters={clearFilters}
      />
    );
  }

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
          <button
            type="button"
            onClick={fetchMatches}
            disabled={isLoading}
            className="flex w-fit cursor-pointer items-center gap-3 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg duration-300 hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 text-sm"
            title="Refresh Matches"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Refreshing..." : "Refresh"}
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
              Review AI-generated lost and found item matches.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search matches..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-purple-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <MatchCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            No matches found
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Matches saved by the matching workflow will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {sortedMatches.slice(0, 2).map((match) => (
              <MatchCard
                key={match.id}
                match={match as any}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteMatch}
              />
            ))}
          </div>

          {sortedMatches.length > 2 && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setShowAllMatches(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-6 py-3.5 font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-indigo-700 cursor-pointer"
              >
                View all possible matches
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Matches;
