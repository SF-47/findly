import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaBoxOpen,
  FaClipboardCheck,
  FaSearch,
  FaTags,
  FaSyncAlt,
} from "react-icons/fa";

function DashCard({ icon, label, value, bgColor }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white shadow-md ${bgColor}`}
      >
        {icon}
      </div>

      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <h1 className="mt-2 text-3xl font-bold">{value}</h1>
    </div>
  );
}

function TableSkeleton({ title, subtitle, columns }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-zinc-700 dark:text-gray-400">
            {columns.map((column) => (
              <th key={column} className="px-5 py-4">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No data loaded yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Dashboard() {
  const stats = [
    {
      label: "Total Students",
      value: "--",
      icon: <FaUsers />,
      bgColor: "bg-blue-600",
    },
    {
      label: "Verified Students",
      value: "--",
      icon: <FaUserCheck />,
      bgColor: "bg-green-600",
    },
    {
      label: "Pending Students",
      value: "--",
      icon: <FaUserClock />,
      bgColor: "bg-yellow-600",
    },
    {
      label: "Categories",
      value: "--",
      icon: <FaTags />,
      bgColor: "bg-indigo-600",
    },
    {
      label: "Lost Items",
      value: "--",
      icon: <FaBoxOpen />,
      bgColor: "bg-red-600",
    },
    {
      label: "Found Items",
      value: "--",
      icon: <FaClipboardCheck />,
      bgColor: "bg-emerald-600",
    },
    {
      label: "Possible Matches",
      value: "--",
      icon: <FaSearch />,
      bgColor: "bg-purple-600",
    },
    {
      label: "Possible ",
      value: "--",
      icon: <FaSearch />,
      bgColor: "bg-purple-600",
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