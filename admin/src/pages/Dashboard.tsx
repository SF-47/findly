import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  PackageOpen,
  RefreshCw,
  Search,
  Tags,
  University as UniversityIcon,
  UserRound,
  UserCheck,
  Clock3,
  Users,
} from "lucide-react";

import DashCard from "../components/Dashboard/DashCard";
import TableSkeleton from "../components/Dashboard/TableSkeleton";
import { getDashboardSummary } from "../services/dashboardService";
import { getLostItems, getFoundItems } from "../services/itemService";
import { getAllStudents } from "../services/studentService";
import { getMatches } from "../services/matchService";
import toast from "react-hot-toast";
import DashCardSkeleton from "../components/Dashboard/DashCardSkeleton";
import { getStoredAdmin } from "../../utils/auth";
import { LostItem, FoundItem, Student, ItemsMatch } from "../types";

//! TS CHANGE : Added explicit type interfaces for dashboard metrics and tables to align with C# API shapes
interface StatsData {
  totalStudents: number;
  verifiedStudents: number;
  pendingStudents: number;
  totalCategories: number;
  lostItems: number;
  foundItems: number;
  possibleMatches: number;
  totalUniversities: number;
}

interface TableData {
  lostItemsData: LostItem[];
  foundItemsData: FoundItem[];
  studentsData: Student[];
  possibleMatchesData: ItemsMatch[];
}

//! TS CHANGE : Typed interface representing the authentication payload saved in storage
interface StoredAdmin {
  id: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
  universityId?: string | null;
  universityShortName?: string;
  universityBranch?: string;
}

function Dashboard() {
  //! TS CHANGE : Asserted the return type of getStoredAdmin using the "as" casting operator
  const admin = getStoredAdmin() as StoredAdmin | null;

  //! TS CHANGE : Configured useState hooks with generic constraints to enforce state object shapes
  const [statsData, setStatsData] = useState<StatsData>({
    totalStudents: 0,
    verifiedStudents: 0,
    pendingStudents: 0,
    totalCategories: 0,
    lostItems: 0,
    foundItems: 0,
    possibleMatches: 0,
    totalUniversities: 0,
  });

  const [dataForTables, setDataForTables] = useState<TableData>({
    lostItemsData: [],
    foundItemsData: [],
    studentsData: [],
    possibleMatchesData: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchDashboardSummary() {
    try {
      setIsLoading(true);
      const data = await getDashboardSummary();

      setStatsData({
        totalStudents: data.totalStudents ?? 0,
        verifiedStudents: data.verifiedStudents ?? 0,
        pendingStudents: data.pendingStudents ?? 0,
        totalCategories: data.totalCategories ?? 0,
        lostItems: data.lostItems ?? 0,
        foundItems: data.foundItems ?? 0,
        possibleMatches: data.possibleMatches ?? 0,
        totalUniversities: data.totalUniversities ?? 0,
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
      const [lostItems, foundItems, students, possibleMatches] =
        await Promise.all([
          getLostItems(),
          getFoundItems(),
          getAllStudents(),
          getMatches(),
        ]);

      setDataForTables({
        lostItemsData: lostItems,
        foundItemsData: foundItems,
        studentsData: students,
        possibleMatchesData: possibleMatches,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load dashboard table data.");
    }
  }

  useEffect(() => {
    fetchDashboardSummary();
    fetchTableData();
  }, []);

  async function refreshDashboard() {
    await Promise.all([fetchDashboardSummary(), fetchTableData()]);
  }

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
      bgColor: "bg-blue-600",
    },
    {
      label: "Pending Students",
      value: statsData.pendingStudents,
      icon: <Clock3 />,
      bgColor: "bg-blue-600",
    },
    {
      label: "Categories",
      value: statsData.totalCategories,
      icon: <Tags />,
      bgColor: "bg-blue-600",
    },
    {
      label: "Lost Items",
      value: statsData.lostItems,
      icon: <PackageOpen />,
      bgColor: "bg-blue-600",
    },
    {
      label: "Found Items",
      value: statsData.foundItems,
      icon: <ClipboardCheck />,
      bgColor: "bg-blue-600",
    },
    {
      label: "Possible Matches",
      value: statsData.possibleMatches,
      icon: <Search />,
      bgColor: "bg-blue-600",
    },
    {
      label: "Universities",
      value: statsData.totalUniversities,
      icon: <UniversityIcon />,
      bgColor: "bg-blue-600",
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
                        admin?.universityBranch
                          ? ` - ${admin.universityBranch}`
                          : ""
                      }`}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={refreshDashboard}
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

        <TableSkeleton
          title="Possible Matches"
          subtitle="Latest AI-generated item matches will appear here."
          columns={["Lost Item", "Found Item", "Score", "Status", "Date"]}
          data={dataForTables.possibleMatchesData}
          type="matches"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default Dashboard;
