import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaBoxOpen,
  FaClipboardCheck,
  FaSearch,
  FaTags,
  FaSyncAlt,
  FaUniversity,
} from "react-icons/fa";

import DashCard from "../components/Dashboard/DashCard";
import TableSkeleton from "../components/Dashboard/TableSkeleton";
import axiosClient from "../api/axiosClient";
import { useEffect, useState } from "react";

function Dashboard() {
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    pendingStudents: 0,
    totalCategories: 0,
    lostItems: 0,
    foundItems: 0,
    possibleMatches: 0,
    totalUniversities: 0,
  }); //7atyton kermel ykoon al response 2deme

  async function fetchDashboardSummary() {
    var response = await axiosClient.get("/dashboard/summary");
    setStatsData(response.data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardSummary();
  }, []);

  const stats = [
    {
      label: "Total Students",
      value: statsData.totalStudents,
      icon: <FaUsers />,
      bgColor: "bg-blue-600",
    },
    {
      label: "Verified Students",
      value: statsData.verifiedStudents,
      icon: <FaUserCheck />,
      bgColor: "bg-green-600",
    },
    {
      label: "Pending Students",
      value: statsData.pendingStudents,
      icon: <FaUserClock />,
      bgColor: "bg-yellow-600",
    },
    {
      label: "Categories",
      value: statsData.totalCategories,
      icon: <FaTags />,
      bgColor: "bg-indigo-600",
    },
    {
      label: "Lost Items",
      value: statsData.lostItems,
      icon: <FaBoxOpen />,
      bgColor: "bg-red-600",
    },
    {
      label: "Found Items",
      value: statsData.foundItems,
      icon: <FaClipboardCheck />,
      bgColor: "bg-emerald-600",
    },
    {
      label: "Possible Matches",
      value: statsData.possibleMatches,
      icon: <FaSearch />,
      bgColor: "bg-purple-600",
    },
    {
      label: "Universities ",
      value: statsData.totalUniversities,
      icon: <FaUniversity />,
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

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Overview of students, lost items, found items, categories, and
            possible matches.
          </p>
        </div>

        <button className="flex w-fit items-center gap-3 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg duration-300 hover:from-blue-600 hover:to-indigo-700">
          <FaSyncAlt size={16} />
          Refresh
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
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
          columns={["Item", "Category", "Student", "Status", "Date"]}
        />

        <TableSkeleton
          title="Recent Found Items"
          subtitle="Latest found item reports will appear here."
          columns={["Item", "Category", "Student", "Status", "Date"]}
        />

        <TableSkeleton
          title="Pending Students"
          subtitle="Students waiting for verification will appear here."
          columns={["Student", "University ID", "Phone", "Status"]}
        />

        <TableSkeleton
          title="Possible Matches"
          subtitle="Generated lost/found matches will appear here."
          columns={["Lost Item", "Found Item", "Match %", "Status"]}
        />
      </div>
    </div>
  );
}

export default Dashboard;
