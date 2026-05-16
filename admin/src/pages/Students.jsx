import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaCalendarDay,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import { useState } from "react";
import AddStudentModal from "../components/Students/AddStudentModal";
import StudentFilter from "../components/Students/StudentFilters";

function StatsCard({ title, subtitle, value, icon, bgColor }) {
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

function Students() {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const stats = [
    {
      title: "Total Students",
      subtitle: "Registered",
      value: "--",
      icon: <FaUsers />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Verified Students",
      subtitle: "Approved",
      value: "--",
      icon: <FaUserCheck />,
      bgColor: "bg-green-500",
    },
    {
      title: "Pending",
      subtitle: "Review",
      value: "--",
      icon: <FaUserClock />,
      bgColor: "bg-yellow-500",
    },
    {
      title: "New Today",
      subtitle: "Today",
      value: "--",
      icon: <FaCalendarDay />,
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Students
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
            Manage registered students, review verification status, and monitor
            new student accounts.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700  cursor-pointer"
            onClick={() => setShowAddStudent(true)}
          >
            <FaPlus />
            Add Student
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            subtitle={stat.subtitle}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Students List
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Student records will appear here.
            </p>
          </div>
          <div>
            <button
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
            onClick={() => setShowFilters((prev) =>!prev)}
          >
            <FaFilter />
            Filter
          </button>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-zinc-700 dark:text-gray-400">
              <th className="px-5 py-4">Student</th>
              <th className="px-5 py-4">University ID</th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Registered Date</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                colSpan="6"
                className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No student data loaded yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {showAddStudent && (
        <AddStudentModal onClose={() => setShowAddStudent(false)} />
      )}
      {showFilters && (
        <StudentFilter onClose={() => setShowFilters((prev) => !prev)} />
      )}
    </div>
  );
}

export default Students;
