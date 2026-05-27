import {
  ClipboardCheck,
  PackageOpen,
  RefreshCw,
  Search,
  Tags,
  University,
  UserRound,
  UserCheck,
  Clock3,
  Users,
} from "lucide-react";

import DashCard from "../components/Dashboard/DashCard";
import TableSkeleton from "../components/Dashboard/TableSkeleton";
import axiosClient from "../api/axiosClient";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashCardSkeleton from "../components/Dashboard/DashCardSkeleton";
import { getStoredAdmin } from "../../utils/auth";

function Dashboard() {
  const admin = getStoredAdmin();

  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    pendingStudents: 0,
    totalCategories: 0,
    lostItems: 0,
    foundItems: 0,
    possibleMatches: 0,
    totalUniversities: 0,
  });

  const [dataForTables, setDataForTables] = useState({
    lostItemsData: [],
    foundItemsData: [],
    studentsData: [],
    matchesData: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  async function fetchDashboardSummary() {
    try {
      setIsLoading(true);

      const response = await axiosClient.get("/dashboard/summary");

      setStatsData({
        totalStudents: response.data.totalStudents ?? 0,
        verifiedStudents: response.data.verifiedStudents ?? 0,
        pendingStudents: response.data.pendingStudents ?? 0,
        totalCategories: response.data.totalCategories ?? 0,
        lostItems: response.data.lostItems ?? 0,
        foundItems: response.data.foundItems ?? 0,
        possibleMatches: response.data.possibleMatches ?? 0,
        totalUniversities: response.data.totalUniversities ?? 0,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTableData() {
    try {
      const [lostItemsResponse, foundItemsResponse, studentsResponse] =
        await Promise.all([
          axiosClient.get("/lost-items"),
          axiosClient.get("/found-items"),
          axiosClient.get("/students"),
        ]);

      setDataForTables({
        lostItemsData: lostItemsResponse.data,
        foundItemsData: foundItemsResponse.data,
        studentsData: studentsResponse.data,
        matchesData: [],
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load dashboard table data.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardSummary();
    fetchTableData();
  }, []);

  const stats = [
    {
      label: "Total Students",
      value: statsData.totalStudents,
      icon: <Users />,
      bgColor: "bg-blue-600",
    },
    {
      label: "Verified Students",
      value: statsData.verifiedStudents,
      icon: <UserCheck />,
      bgColor: "bg-green-600",
    },
    {
      label: "Pending Students",
      value: statsData.pendingStudents,
      icon: <Clock3 />,
      bgColor: "bg-yellow-600",
    },
    {
      label: "Categories",
      value: statsData.totalCategories,
      icon: <Tags />,
      bgColor: "bg-indigo-600",
    },
    {
      label: "Lost Items",
      value: statsData.lostItems,
      icon: <PackageOpen />,
      bgColor: "bg-red-600",
    },
    {
      label: "Found Items",
      value: statsData.foundItems,
      icon: <ClipboardCheck />,
      bgColor: "bg-emerald-600",
    },
    {
      label: "Possible Matches",
      value: statsData.possibleMatches,
      icon: <Search />,
      bgColor: "bg-purple-600",
    },
    {
      label: "Universities",
      value: statsData.totalUniversities,
      icon: <University />,
      bgColor: "bg-cyan-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500 dark:text-zinc-400">
            Overview of students, lost items, found items, categories, and
            possible matches.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                <UserRound size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {admin?.fullName || "Admin"}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                  {admin?.role === "Owner"
                    ? "Owner - All Universities"
                    : `${admin?.universityShortName || "University"}${
                        admin?.universityBranch ? ` - ${admin.universityBranch}` : ""
                      }`}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchDashboardSummary}
            disabled={isLoading}
            className="flex w-fit cursor-pointer items-center gap-3 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg duration-300 hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <DashCardSkeleton key={index} />
            ))
          : stats.map((stat) => (
              <DashCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                bgColor={stat.bgColor}
              />
            ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TableSkeleton
          title="Recent Lost Items"
          subtitle="Latest lost item reports will appear here."
          columns={["Item", "University", "Student", "Status", "Date"]}
          data={dataForTables.lostItemsData}
          type="lost"
          isLoading={isLoading}
        />

        <TableSkeleton
          title="Recent Found Items"
          subtitle="Latest found item reports will appear here."
          columns={["Item", "Category", "Student", "Status", "Date"]}
          data={dataForTables.foundItemsData}
          type="found"
          isLoading={isLoading}
        />

        <TableSkeleton
          title="Pending Students"
          subtitle="Students waiting for verification will appear here."
          columns={["Student", "University ID", "Phone", "Status"]}
          data={dataForTables.studentsData.filter((s) => !s.isVerified)}
          type="students"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default Dashboard;
